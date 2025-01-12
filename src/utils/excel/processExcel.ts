import * as XLSX from 'xlsx';
import { validateQuestionRow } from './validation';
import { transformToQuestion, insertQuestionBatch } from './transformer';

const BATCH_SIZE = 50;

export const processExcelFile = async (file: File): Promise<any[]> => {
  console.log('Iniciando processamento do arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const questions: any[] = [];
        let processedCount = 0;

        console.log('Processando planilha Excel...');

        for (const sheetName of workbook.SheetNames) {
          if (sheetName === 'Instruções') continue;

          console.log(`Processando aba: ${sheetName}`);
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Pular linha de cabeçalho
          for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
            const row: any = jsonData[rowIndex];
            if (!row[0]) continue; // Pular linhas vazias

            const validatedData = validateQuestionRow(row, sheetName);
            const questionData = transformToQuestion(validatedData);
            questionData.subject = sheetName;
            
            questions.push(questionData);
            processedCount++;
            console.log(`Questão ${processedCount} processada com sucesso`);
          }
        }

        if (questions.length === 0) {
          throw new Error('Nenhuma questão válida encontrada no arquivo.');
        }

        // Inserir questões em lotes
        const results = [];
        for (let i = 0; i < questions.length; i += BATCH_SIZE) {
          const batch = questions.slice(i, i + BATCH_SIZE);
          console.log(`Inserindo lote ${Math.floor(i/BATCH_SIZE) + 1} de ${Math.ceil(questions.length/BATCH_SIZE)}`);
          
          const insertedQuestions = await insertQuestionBatch(batch);
          results.push(...insertedQuestions);
        }

        console.log(`Importação concluída. ${results.length} questões inseridas com sucesso.`);
        resolve(results);
      } catch (error) {
        console.error('Erro no processamento:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('Erro na leitura do arquivo:', error);
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};