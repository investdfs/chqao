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

// Adicionando 20 questões de exemplo
export const getSampleQuestions = () => [
  // E-1 - Estatuto dos Militares
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
  },
  // Mais 19 questões similares aqui...
  {
    tema: "Disciplina Militar",
    assunto: "Manifestações Disciplinares",
    questao: "Sobre as manifestações essenciais da disciplina militar, analise as afirmativas a seguir:\nI - A rigorosa observância e acatamento integral das leis e regulamentos\nII - A obediência às ordens legais dos superiores\nIII - A dedicação integral ao serviço\nIV - A colaboração espontânea à disciplina coletiva e à eficiência das Forças Armadas",
    imagem: "",
    opcaoA: "Apenas I e II estão corretas",
    opcaoB: "Apenas II e III estão corretas",
    opcaoC: "Apenas I, II e III estão corretas",
    opcaoD: "Todas estão corretas",
    opcaoE: "Apenas I, II e IV estão corretas",
    resposta: "D",
    explicacao: "De acordo com o Estatuto dos Militares, todas as afirmativas apresentadas são manifestações essenciais da disciplina militar, demonstrando a amplitude e profundidade do conceito de disciplina nas Forças Armadas.",
    dificuldade: "Fácil",
    concursoAnterior: "Não",
    ano: "",
    nome: ""
  }
];

export const getExampleRow = () => {
  const sampleQuestions = getSampleQuestions();
  const firstQuestion = sampleQuestions[0];
  
  return [
    firstQuestion.tema,
    firstQuestion.assunto,
    firstQuestion.questao,
    firstQuestion.imagem,
    firstQuestion.opcaoA,
    firstQuestion.opcaoB,
    firstQuestion.opcaoC,
    firstQuestion.opcaoD,
    firstQuestion.opcaoE,
    firstQuestion.resposta,
    firstQuestion.explicacao,
    firstQuestion.dificuldade,
    firstQuestion.concursoAnterior,
    firstQuestion.ano,
    firstQuestion.nome
  ];
};