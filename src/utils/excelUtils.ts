import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const downloadExcelTemplate = () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const headers = [
      "Tema", "Matéria", "Assunto", "Questão", "URL da Imagem",
      "Opção A", "Opção B", "Opção C", "Opção D", "Opção E",
      "Resposta Correta", "Explicação", "Dificuldade",
      "Questão de Concurso Anterior?", "Ano do Concurso", "Nome do Concurso"
    ];

    // Criar exemplos para cada tema
    const templateData = {
      'Exemplo': [
        [
          "Conhecimentos Gerais", "Língua Portuguesa", "Interpretação e compreensão de textos",
          "Qual a ideia principal do texto apresentado?", "",
          "Crítica social", "Análise histórica", "Reflexão filosófica", 
          "Descrição científica", "Narrativa literária",
          "A", "A questão avalia a capacidade de identificar o tema central do texto.", 
          "Médio", "Não", "", ""
        ],
        [
          "Conhecimentos Profissionais (CHQAO e CHQAOMus)", "E-1 - Estatuto dos Militares", 
          "Princípios fundamentais: hierarquia e disciplina",
          "Sobre os princípios fundamentais da hierarquia militar, é correto afirmar que:", "",
          "É a base da organização militar", 
          "É opcional em tempos de paz",
          "Aplica-se apenas aos oficiais",
          "Pode ser flexibilizada conforme a situação",
          "Não se aplica em missões especiais",
          "A", "A hierarquia é um dos pilares fundamentais da organização militar.",
          "Fácil", "Não", "", ""
        ]
      ]
    };

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Configurar larguras das colunas
    const colWidths = [
      { wch: 25 },  // Tema
      { wch: 20 },  // Matéria
      { wch: 20 },  // Assunto
      { wch: 50 },  // Questão
      { wch: 30 },  // URL da Imagem
      { wch: 20 },  // Opção A
      { wch: 20 },  // Opção B
      { wch: 20 },  // Opção C
      { wch: 20 },  // Opção D
      { wch: 20 },  // Opção E
      { wch: 15 },  // Resposta Correta
      { wch: 50 },  // Explicação
      { wch: 10 },  // Dificuldade
      { wch: 15 },  // Questão de Concurso
      { wch: 15 },  // Ano
      { wch: 20 }   // Nome do Concurso
    ];

    // Criar uma aba para cada tema
    Object.entries(templateData).forEach(([sheetName, examples]) => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);
      ws['!cols'] = colWidths;

      // Estilização do cabeçalho
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Q2');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1A4D2E" } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Adicionar aba de instruções
    const instructions = [
      ["Instruções para Preenchimento"],
      [""],
      ["1. Organize as questões seguindo a hierarquia: Tema > Matéria > Assunto"],
      ["2. Mantenha o formato exato das colunas ao adicionar suas questões"],
      ["3. A coluna 'Resposta Correta' deve conter apenas A, B, C, D ou E"],
      ["4. A coluna 'Dificuldade' deve ser preenchida com: Fácil, Médio ou Difícil"],
      ["5. O campo 'URL da Imagem' é opcional - deixe em branco se não houver imagem"],
      ["6. Para questões de concursos anteriores, marque 'Sim' e preencha o ano e nome"],
      ["7. Você pode adicionar quantas linhas quiser"],
      ["8. Não modifique o cabeçalho das colunas"]
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions['!cols'] = [{ wch: 80 }];
    wsInstructions['A1'].s = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1A4D2E" } },
      alignment: { horizontal: 'center' }
    };

    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instruções");

    XLSX.writeFile(wb, "modelo_questoes.xlsx");
    console.log('Download do template concluído com sucesso');
  } catch (error) {
    console.error('Erro ao gerar template Excel:', error);
    throw error;
  }
};

export const processExcelFile = async (file: File): Promise<any[]> => {
  console.log('Iniciando processamento do arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Mapear os dados para o formato do banco
        const questions = jsonData.map((row: any) => ({
          theme: row['Tema'],
          subject: row['Matéria'],
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