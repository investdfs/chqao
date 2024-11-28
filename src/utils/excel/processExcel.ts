import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

const validateQuestion = (question: any) => {
  const requiredFields = [
    'subject',
    'text',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'option_e',
    'correct_answer'
  ];

  const missingFields = requiredFields.filter(field => !question[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
  }

  if (!['A', 'B', 'C', 'D', 'E'].includes(question.correct_answer.toUpperCase())) {
    throw new Error('Resposta correta deve ser A, B, C, D ou E');
  }

  return true;
};

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
        let errorCount = 0;

        console.log('Processando planilha Excel...');

        for (const sheetName of workbook.SheetNames) {
          if (sheetName === 'Instruções') continue;

          console.log(`Processando aba: ${sheetName}`);
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const materia = sheetName;
          
          for (const row of jsonData) {
            try {
              const question = {
                subject: materia,
                theme: row['Tema'] || null,
                topic: row['Assunto'] || null,
                text: row['Questão'],
                image_url: row['URL da Imagem'] || null,
                option_a: row['Opção A'],
                option_b: row['Opção B'],
                option_c: row['Opção C'],
                option_d: row['Opção D'],
                option_e: row['Opção E'],
                correct_answer: String(row['Resposta Correta']).toUpperCase(),
                explanation: row['Explicação'] || null,
                difficulty: row['Dificuldade'] || 'Médio',
                is_from_previous_exam: row['Questão de Concurso Anterior?']?.toLowerCase() === 'sim',
                exam_year: row['Ano do Concurso'] ? parseInt(row['Ano do Concurso']) : null,
                exam_name: row['Nome do Concurso'] || null
              };

              validateQuestion(question);
              questions.push(question);
              processedCount++;
              
              console.log(`Questão processada com sucesso: ${question.text.substring(0, 50)}...`);
            } catch (error) {
              errorCount++;
              console.error(`Erro ao processar linha ${processedCount + errorCount + 1}:`, error);
              // Continua processando outras questões mesmo se uma falhar
            }
          }
        }

        console.log(`Processamento concluído. ${processedCount} questões válidas, ${errorCount} erros.`);

        if (questions.length === 0) {
          throw new Error('Nenhuma questão válida encontrada no arquivo.');
        }

        // Inserir questões em lotes de 50
        const batchSize = 50;
        const results = [];
        
        for (let i = 0; i < questions.length; i += batchSize) {
          const batch = questions.slice(i, i + batchSize);
          console.log(`Inserindo lote ${i/batchSize + 1} de ${Math.ceil(questions.length/batchSize)}`);
          
          const { data, error } = await supabase
            .from('questions')
            .insert(batch)
            .select();

          if (error) throw error;
          if (data) results.push(...data);
        }

        console.log('Todas as questões foram inseridas com sucesso:', results.length);
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