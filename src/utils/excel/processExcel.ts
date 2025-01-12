import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { validateExcelData } from './templateData';

export const processExcelFile = async (file: File): Promise<any[]> => {
  console.log('Iniciando processamento do arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const questions: any[] = [];
        const errors: any[] = [];
        let processedCount = 0;
        let errorCount = 0;

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

            // Validar dados
            const validationErrors = validateExcelData(row, sheetName);
            
            if (validationErrors.length > 0) {
              errors.push({
                row: rowIndex + 1,
                sheet: sheetName,
                errors: validationErrors
              });
              errorCount++;
              continue;
            }

            const question = {
              theme: row[0],
              topic: row[1],
              text: row[2],
              image_url: row[3] || null,
              option_a: row[4],
              option_b: row[5],
              option_c: row[6],
              option_d: row[7],
              option_e: row[8],
              correct_answer: String(row[9]).toUpperCase(),
              explanation: row[10],
              difficulty: row[11] || 'Médio',
              is_from_previous_exam: row[12]?.toLowerCase() === 'sim',
              exam_year: row[13] ? parseInt(row[13]) : null,
              exam_name: row[14] || null,
              subject: sheetName,
              status: 'active'
            };

            questions.push(question);
            processedCount++;
            console.log(`Questão ${processedCount} processada com sucesso`);
          }
        }

        if (errors.length > 0) {
          console.error('Erros encontrados durante o processamento:', errors);
          throw new Error(`Encontrados ${errors.length} erros no arquivo. Verifique o console para detalhes.`);
        }

        if (questions.length === 0) {
          throw new Error('Nenhuma questão válida encontrada no arquivo.');
        }

        // Inserir questões em lotes de 50
        const batchSize = 50;
        const results = [];
        
        for (let i = 0; i < questions.length; i += batchSize) {
          const batch = questions.slice(i, i + batchSize);
          console.log(`Inserindo lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(questions.length/batchSize)}`);
          
          const { data, error: uploadError } = await supabase
            .from('questions')
            .insert(batch)
            .select();

          if (uploadError) {
            console.error('Erro ao inserir lote:', uploadError);
            throw uploadError;
          }

          if (data) {
            results.push(...data);
            console.log(`Lote ${Math.floor(i/batchSize) + 1} inserido com sucesso`);
          }
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