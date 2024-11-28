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
  },
  {
    tema: "Regulamento Disciplinar",
    assunto: "Transgressões Disciplinares",
    questao: "Sobre as transgressões disciplinares no âmbito militar, analise a seguinte situação: Um militar deixa de comunicar ao superior imediato a alteração de seu endereço residencial. Esta conduta é classificada como:",
    imagem: "",
    opcaoA: "Transgressão leve",
    opcaoB: "Transgressão média",
    opcaoC: "Transgressão grave",
    opcaoD: "Não constitui transgressão",
    opcaoE: "Depende do tempo decorrido sem a comunicação",
    resposta: "A",
    explicacao: "De acordo com o Regulamento Disciplinar do Exército, deixar de comunicar ao superior imediato a alteração de endereço residencial é classificada como transgressão leve, pois afeta apenas aspectos administrativos da organização militar.",
    dificuldade: "Fácil",
    concursoAnterior: "Sim",
    ano: "2022",
    nome: "EsFCEx"
  }
];