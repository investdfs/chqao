import * as XLSX from 'xlsx';
import { templateSubjects, getTemplateHeaders, getExampleRow } from './excel/templateData';
import { supabase } from "@/integrations/supabase/client";

export const processExcelFile = async (file: File) => {
  console.log('Iniciando processamento do arquivo Excel');
  
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const insertedQuestions = [];

    for (const sheetName of workbook.SheetNames) {
      if (sheetName === 'Instruções') continue;
      
      console.log(`Processando aba: ${sheetName}`);
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Skip header row
      for (let i = 1; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        if (!row[0]) continue; // Skip empty rows

        const question = {
          theme: row[0],
          subject_matter: row[1],
          text: row[2],
          image_url: row[3] || null,
          option_a: row[4],
          option_b: row[5],
          option_c: row[6],
          option_d: row[7],
          option_e: row[8],
          correct_answer: row[9],
          explanation: row[10] || null,
          difficulty: row[11] || 'Médio',
          is_from_previous_exam: row[12] === 'Sim',
          exam_year: row[13] ? parseInt(row[13]) : null,
          exam_name: row[14] || null,
          subject: sheetName
        };

        console.log(`Inserindo questão: ${question.text.substring(0, 50)}...`);
        
        const { data, error } = await supabase
          .from('questions')
          .insert([question])
          .select();

        if (error) {
          console.error('Erro ao inserir questão:', error);
          throw error;
        }

        if (data) {
          insertedQuestions.push(data[0]);
        }
      }
    }

    console.log(`Processamento concluído. ${insertedQuestions.length} questões inseridas.`);
    return insertedQuestions;
  } catch (error) {
    console.error('Erro ao processar arquivo Excel:', error);
    throw error;
  }
};

export const downloadExcelTemplate = async () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const wb = XLSX.utils.book_new();
    const headers = getTemplateHeaders();
    const exampleRow = getExampleRow();

    // Criar uma aba para cada matéria
    templateSubjects.forEach(subject => {
      console.log(`Criando aba para: ${subject}`);
      
      const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

      // Configurar largura das colunas
      const colWidths = [
        { wch: 25 },  // Tema
        { wch: 25 },  // Assunto
        { wch: 50 },  // Questão
        { wch: 30 },  // URL da Imagem
        { wch: 20 },  // Opção A
        { wch: 20 },  // Opção B
        { wch: 20 },  // Opção C
        { wch: 20 },  // Opção D
        { wch: 20 },  // Opção E
        { wch: 15 },  // Resposta Correta
        { wch: 50 },  // Explicação
        { wch: 15 },  // Dificuldade
        { wch: 15 },  // Questão de Concurso
        { wch: 15 },  // Ano
        { wch: 25 }   // Nome do Concurso
      ];

      ws['!cols'] = colWidths;
      XLSX.utils.book_append_sheet(wb, ws, subject);
    });

    // Adicionar aba de instruções
    const instructions = [
      ["Instruções para Preenchimento"],
      [""],
      ["1. Cada aba representa uma matéria diferente"],
      ["2. Organize as questões por Tema e Assunto dentro de cada matéria"],
      ["3. Mantenha o formato exato das colunas ao adicionar suas questões"],
      ["4. A coluna 'Resposta Correta' deve conter apenas A, B, C, D ou E"],
      ["5. A coluna 'Dificuldade' deve ser preenchida com: Fácil, Médio ou Difícil"],
      ["6. O campo 'URL da Imagem' é opcional - deixe em branco se não houver imagem"],
      ["7. Para questões de concursos anteriores, marque 'Sim' e preencha o ano e nome"],
      ["8. Você pode adicionar quantas linhas quiser em cada aba"],
      ["9. Não modifique o cabeçalho das colunas"]
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instruções");

    // Download do arquivo
    console.log("Gerando arquivo para download...");
    XLSX.writeFile(wb, "modelo_questoes.xlsx");
    console.log("Download do template concluído com sucesso");
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar template Excel:', error);
    throw error;
  }
};