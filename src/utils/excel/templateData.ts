export const templateSubjects = [
  'Língua Portuguesa',
  'Geografia do Brasil',
  'História do Brasil',
  'E-1 - Estatuto dos Militares',
  'Licitações e Contratos',
  'R-3 - Regulamento de Administração do Exército (RAE)',
  'Direito Militar e Sindicância',
  'Conhecimentos Musicais Gerais',
  'Técnicas e habilidades de leitura e escrita musical'
];

export const getTemplateHeaders = () => [
  "Tema",
  "Assunto",
  "Questão",
  "URL da Imagem",
  "Opção A",
  "Opção B",
  "Opção C",
  "Opção D",
  "Opção E",
  "Resposta Correta",
  "Explicação",
  "Dificuldade",
  "Questão de Concurso Anterior?",
  "Ano do Concurso",
  "Nome do Concurso"
];

export const getSampleQuestions = () => [
  {
    tema: "Hierarquia Militar",
    assunto: "Círculos Hierárquicos",
    questao: "De acordo com o Estatuto dos Militares, os círculos hierárquicos são âmbitos de convivência entre os militares da mesma categoria e têm a finalidade de desenvolver o espírito de camaradagem, em ambiente de estima e confiança, sem prejuízo do respeito mútuo. Sobre os círculos hierárquicos, é correto afirmar que:",
    imagem: "",
    opcaoA: "Os Guardas-Marinha e Aspirantes-a-Oficial são hierarquicamente superiores às demais praças",
    opcaoB: "Os Suboficiais e Sargentos pertencem ao mesmo círculo hierárquico dos Oficiais Subalternos",
    opcaoC: "Os Cabos e Soldados não constituem um círculo hierárquico próprio",
    opcaoD: "Os Oficiais Generais pertencem ao mesmo círculo hierárquico dos Oficiais Superiores",
    opcaoE: "Os Oficiais Intermediários e Subalternos pertencem a círculos hierárquicos distintos",
    resposta: "A",
    explicacao: "Conforme o Estatuto dos Militares, os Guardas-Marinha e Aspirantes-a-Oficial são, de fato, hierarquicamente superiores às demais praças, constituindo uma categoria especial dentro da hierarquia militar.",
    dificuldade: "Médio",
    concursoAnterior: "Não",
    ano: "",
    nome: ""
  }
];

export const validateExcelData = (row: any, sheetName: string) => {
  const errors = [];
  
  // Campos obrigatórios
  const requiredFields = {
    "Questão": row[2],
    "Opção A": row[4],
    "Opção B": row[5],
    "Opção C": row[6],
    "Opção D": row[7],
    "Opção E": row[8],
    "Resposta Correta": row[9],
    "Explicação": row[10]
  };

  // Verificar campos obrigatórios
  Object.entries(requiredFields).forEach(([field, value]) => {
    if (!value) {
      errors.push(`Campo "${field}" é obrigatório`);
    }
  });

  // Validar resposta correta
  const validAnswers = ['A', 'B', 'C', 'D', 'E'];
  if (row[9] && !validAnswers.includes(row[9].toUpperCase())) {
    errors.push('Resposta Correta deve ser A, B, C, D ou E');
  }

  // Validar dificuldade
  const validDifficulties = ['Fácil', 'Médio', 'Difícil'];
  if (row[11] && !validDifficulties.includes(row[11])) {
    errors.push('Dificuldade deve ser Fácil, Médio ou Difícil');
  }

  // Validar ano do concurso
  if (row[13] && isNaN(parseInt(row[13]))) {
    errors.push('Ano do Concurso deve ser um número válido');
  }

  return errors;
};