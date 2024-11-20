import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

export const processExcelFile = async (file: File): Promise<any[]> => {
  console.log('Iniciando processamento do arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const questions: any[] = [];

        workbook.SheetNames.forEach(sheetName => {
          if (sheetName === 'Instruções') return;

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const materia = sheetName;
          const questoesDaMateria = jsonData.map((row: any) => ({
            theme: row['Tema'],
            subject: materia,
            topic: row['Assunto'],
            text: row['Questão'],
            image_url: row['URL da Imagem'] || null,
            option_a: row['Opção A'],
            option_b: row['Opção B'],
            option_c: row['Opção C'],
            option_d: row['Opção D'],
            option_e: row['Opção E'],
            correct_answer: row['Resposta Correta'],
            explanation: row['Explicação'],
            difficulty: row['Dificuldade'],
            is_from_previous_exam: row['Questão de Concurso Anterior?']?.toLowerCase() === 'sim',
            exam_year: row['Ano do Concurso'] || null,
            exam_name: row['Nome do Concurso'] || null
          }));

          questions.push(...questoesDaMateria);
        });

        const { data: insertedData, error } = await supabase
          .from('questions')
          .insert(questions)
          .select();

        if (error) throw error;

        console.log('Questões inseridas com sucesso:', insertedData);
        resolve(insertedData);
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