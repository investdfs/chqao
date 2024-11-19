import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const downloadExcelTemplate = () => {
  const headers = ["Matéria", "Tópico", "Questão", "Opção A", "Opção B", "Opção C", "Opção D", "Opção E", "Resposta Correta", "Explicação", "Dificuldade"];
  
  const data = [
    ["Matemática", "Álgebra", "Quanto é 2 + 2?", "2", "3", "4", "5", "6", "C", "A soma de 2 + 2 é igual a 4", "Fácil"],
    ["Português", "Gramática", "O que é um substantivo?", "Palavra que indica ação", "Palavra que nomeia seres", "Palavra que qualifica", "Palavra que liga", "Palavra que modifica", "B", "Substantivo é a palavra que nomeia seres, objetos, lugares, sentimentos, etc.", "Médio"]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, "modelo_questoes.xlsx");
};

export const processExcelFile = async (file: File): Promise<any[]> => {
  console.log('Iniciando processamento do arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        console.log('Arquivo carregado, iniciando parse');
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Dados parseados:', jsonData);

        // Mapear os dados para o formato do banco
        const questions = jsonData.map((row: any) => ({
          subject: row['Matéria'],
          topic: row['Tópico'],
          text: row['Questão'],
          option_a: row['Opção A'],
          option_b: row['Opção B'],
          option_c: row['Opção C'],
          option_d: row['Opção D'],
          option_e: row['Opção E'],
          correct_answer: row['Resposta Correta'],
          explanation: row['Explicação'],
          difficulty: row['Dificuldade']
        }));

        // Inserir questões no banco
        console.log('Iniciando inserção no banco:', questions);
        const { data: insertedData, error } = await supabase
          .from('questions')
          .insert(questions)
          .select();

        if (error) {
          console.error('Erro ao inserir questões:', error);
          throw error;
        }

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