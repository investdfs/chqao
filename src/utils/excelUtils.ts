import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const downloadExcelTemplate = () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const headers = ["Matéria", "Tópico", "Questão", "Opção A", "Opção B", "Opção C", "Opção D", "Opção E", "Resposta Correta", "Explicação", "Dificuldade"];
    
    const data = [
      ["Matemática", "Álgebra", "Se 2x + 3 = 11, qual é o valor de x?", "2", "3", "4", "5", "6", "C", "Para resolver, subtraímos 3 dos dois lados: 2x = 8. Depois dividimos por 2: x = 4", "Fácil"],
      ["Português", "Gramática", "Qual é a classe gramatical da palavra 'rapidamente'?", "Substantivo", "Adjetivo", "Advérbio", "Preposição", "Conjunção", "C", "Rapidamente é um advérbio pois modifica um verbo, indicando modo", "Médio"],
      ["História", "Brasil Colônia", "Em que ano o Brasil foi descoberto?", "1498", "1500", "1502", "1504", "1496", "B", "O Brasil foi descoberto oficialmente em 22 de abril de 1500 por Pedro Álvares Cabral", "Fácil"],
      ["Geografia", "Clima", "Qual é o clima predominante no Brasil?", "Tropical", "Temperado", "Polar", "Mediterrâneo", "Desértico", "A", "O clima tropical é predominante no Brasil, caracterizado por temperaturas elevadas e duas estações bem definidas", "Médio"],
      ["Física", "Mecânica", "Qual é a unidade de medida de força no SI?", "Watt", "Joule", "Pascal", "Newton", "Metro", "D", "O Newton (N) é a unidade de força no Sistema Internacional de Unidades", "Médio"],
      ["Química", "Tabela Periódica", "Qual é o símbolo do elemento Ouro?", "Ag", "Fe", "Au", "Cu", "Pt", "C", "Au é o símbolo do Ouro, derivado do latim 'Aurum'", "Fácil"],
      ["Biologia", "Genética", "Qual é a molécula responsável pelo armazenamento da informação genética?", "RNA", "Proteína", "DNA", "Lipídio", "Carboidrato", "C", "O DNA (Ácido Desoxirribonucleico) é a molécula que armazena o código genético", "Médio"],
      ["Literatura", "Modernismo", "Quem escreveu 'Macunaíma'?", "Carlos Drummond", "Mário de Andrade", "Manuel Bandeira", "Cecília Meireles", "Jorge Amado", "B", "Macunaíma foi escrito por Mário de Andrade em 1928, sendo uma das principais obras do modernismo brasileiro", "Difícil"],
      ["Inglês", "Verbos", "What is the past tense of 'go'?", "Goed", "Gone", "Went", "Going", "Goes", "C", "O passado simples do verbo 'go' é 'went'", "Fácil"],
      ["Filosofia", "Ética", "Quem é considerado o pai da filosofia ocidental?", "Platão", "Aristóteles", "Sócrates", "Pitágoras", "Heráclito", "C", "Sócrates é considerado o pai da filosofia ocidental por seu método de questionamento e busca pela verdade", "Médio"]
    ];

    // Criar uma nova planilha
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

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
    ws['!cols'] = colWidths;

    // Adicionar a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    console.log('Preparando para download do arquivo');
    
    // Salvar o arquivo no formato .xls em vez de .xlsx
    XLSX.writeFile(wb, "modelo_questoes.xls", { bookType: "xls" });
    
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