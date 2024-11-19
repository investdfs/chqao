import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const downloadExcelTemplate = () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const headers = [
      "Matéria", "Tópico", "Questão", "Opção A", "Opção B", "Opção C", 
      "Opção D", "Opção E", "Resposta Correta", "Explicação", "Dificuldade"
    ];

    // Criar exemplos para cada matéria
    const templateData = {
      'Matemática': [
        ["Matemática", "Álgebra", "Se 2x + 3 = 11, qual é o valor de x?", "2", "3", "4", "5", "6", "C", "Para resolver, subtraímos 3 dos dois lados: 2x = 8. Depois dividimos por 2: x = 4", "Fácil"],
        ["Matemática", "Geometria", "Qual é a área de um quadrado de lado 5cm?", "15cm²", "20cm²", "25cm²", "30cm²", "35cm²", "C", "A área do quadrado é lado², então 5² = 25cm²", "Fácil"]
      ],
      'Português': [
        ["Português", "Gramática", "Qual é a classe gramatical da palavra 'rapidamente'?", "Substantivo", "Adjetivo", "Advérbio", "Preposição", "Conjunção", "C", "Rapidamente é um advérbio pois modifica um verbo, indicando modo", "Médio"],
        ["Português", "Literatura", "Quem escreveu 'Vidas Secas'?", "Jorge Amado", "Graciliano Ramos", "José de Alencar", "Machado de Assis", "Guimarães Rosa", "B", "Vidas Secas foi escrito por Graciliano Ramos em 1938", "Médio"]
      ],
      'História': [
        ["História", "Brasil Colônia", "Em que ano o Brasil foi descoberto?", "1498", "1500", "1502", "1504", "1496", "B", "O Brasil foi descoberto oficialmente em 22 de abril de 1500 por Pedro Álvares Cabral", "Fácil"],
        ["História", "Brasil República", "Quem foi o primeiro presidente do Brasil?", "D. Pedro II", "Deodoro da Fonseca", "Floriano Peixoto", "Prudente de Morais", "Campos Sales", "B", "Deodoro da Fonseca foi o primeiro presidente do Brasil, após a Proclamação da República", "Médio"]
      ]
    };

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Configurar larguras das colunas
    const colWidths = [
      { wch: 15 },  // Matéria
      { wch: 15 },  // Tópico
      { wch: 50 },  // Questão
      { wch: 20 },  // Opção A
      { wch: 20 },  // Opção B
      { wch: 20 },  // Opção C
      { wch: 20 },  // Opção D
      { wch: 20 },  // Opção E
      { wch: 15 },  // Resposta Correta
      { wch: 50 },  // Explicação
      { wch: 10 }   // Dificuldade
    ];

    // Criar uma aba para cada matéria
    Object.entries(templateData).forEach(([subject, examples]) => {
      // Criar worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);

      // Aplicar larguras das colunas
      ws['!cols'] = colWidths;

      // Estilização
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:K2');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1A4D2E" } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }

      // Adicionar a worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, subject);
    });

    // Adicionar uma aba de instruções
    const instructions = [
      ["Instruções para Preenchimento"],
      [""],
      ["1. Cada aba contém exemplos de questões para uma matéria específica"],
      ["2. Mantenha o formato exato das colunas ao adicionar suas questões"],
      ["3. A coluna 'Resposta Correta' deve conter apenas A, B, C, D ou E"],
      ["4. A coluna 'Dificuldade' deve ser preenchida com: Fácil, Médio ou Difícil"],
      ["5. Não deixe campos em branco"],
      ["6. Você pode adicionar quantas linhas quiser em cada aba"],
      ["7. Não modifique o cabeçalho das colunas"]
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions['!cols'] = [{ wch: 80 }];
    wsInstructions['A1'].s = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1A4D2E" } },
      alignment: { horizontal: 'center' }
    };

    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instruções");

    console.log('Preparando para download do arquivo');
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