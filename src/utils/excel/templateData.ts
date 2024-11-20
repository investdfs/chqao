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

export const getTemplateData = () => {
  const templateData: Record<string, any[]> = {};
  
  templateSubjects.forEach(subject => {
    templateData[subject] = [
      [
        "Tema", "Assunto",
        "Questão", "",
        "Opção A", "Opção B", "Opção C", 
        "Opção D", "Opção E",
        "A", "Explicação exemplo para a questão.", 
        "Médio", "Não", "", ""
      ]
    ];
  });

  return templateData;
};