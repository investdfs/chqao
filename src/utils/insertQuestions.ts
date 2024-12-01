import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type QuestionDifficulty = Database["public"]["Enums"]["question_difficulty"];

const questions: {
  subject: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  theme: string;
  topic: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  is_from_previous_exam: boolean;
}[] = [
  {
    subject: "História do Brasil",
    text: "Qual das alternativas abaixo NÃO representa uma das fases da Era Vargas?",
    option_a: "Governo Provisório (1930-1934)",
    option_b: "Governo Constitucional (1934-1937)",
    option_c: "Estado Novo (1937-1945)",
    option_d: "República Velha (1889-1930)",
    option_e: "Queremismo (1945)",
    correct_answer: "D",
    theme: "Era Vargas",
    topic: "Fases da Era Vargas",
    explanation: "A Era Vargas é comumente dividida em três fases: Governo Provisório, Governo Constitucional e Estado Novo. A República Velha antecede a Era Vargas, e o Queremismo é um movimento ocorrido no fim do Estado Novo.",
    difficulty: "Fácil",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "Durante o Governo Provisório (1930-1934), Getúlio Vargas adotou diversas medidas para consolidar seu poder e lidar com os desafios do país. Qual das seguintes ações NÃO foi implementada nesse período?",
    option_a: "Fechamento do Congresso Nacional e das Câmaras Estaduais.",
    option_b: "Nomeação de interventores para os estados, muitos dos quais eram tenentes.",
    option_c: "Implementação da Consolidação das Leis do Trabalho (CLT).",
    option_d: "Criação do Ministério do Trabalho, Indústria e Comércio.",
    option_e: "Compra e queima de estoques de café para combater a crise.",
    correct_answer: "C",
    theme: "Era Vargas",
    topic: "Governo Provisório",
    explanation: "A CLT foi promulgada em 1943, durante o Estado Novo. As demais alternativas refletem medidas tomadas por Vargas durante o Governo Provisório.",
    difficulty: "Médio",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "A Constituição de 1934, promulgada durante o Governo Constitucional de Vargas, introduziu importantes mudanças no sistema político e social brasileiro. Qual das alternativas abaixo NÃO corresponde a uma inovação trazida por essa Constituição?",
    option_a: "Voto secreto.",
    option_b: "Voto feminino.",
    option_c: "Direitos trabalhistas, como salário mínimo e jornada de trabalho de 8 horas.",
    option_d: "Mandato presidencial de seis anos.",
    option_e: "Criação da Justiça Eleitoral.",
    correct_answer: "D",
    theme: "Era Vargas",
    topic: "Governo Constitucional e a Constituição de 1934",
    explanation: "A Constituição de 1934 estabelecia um mandato presidencial de quatro anos. As demais alternativas representam avanços incorporados pela Carta de 1934.",
    difficulty: "Médio",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "O Estado Novo (1937-1945), período marcado pelo autoritarismo de Getúlio Vargas, foi instaurado após um golpe de estado. Qual dos eventos abaixo serviu como pretexto para a instauração do Estado Novo?",
    option_a: "A Revolução Constitucionalista de 1932.",
    option_b: "A Intentona Comunista de 1935.",
    option_c: "O movimento integralista de 1938.",
    option_d: "A eclosão da Segunda Guerra Mundial em 1939.",
    option_e: "O Queremismo de 1945.",
    correct_answer: "B",
    theme: "Era Vargas",
    topic: "Estado Novo e o Golpe de 1937",
    explanation: "Vargas utilizou a ameaça comunista representada pela Intentona Comunista como justificativa para o fechamento do Congresso e a implantação do Estado Novo.",
    difficulty: "Fácil",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "Durante o Estado Novo, Getúlio Vargas buscou fortalecer o nacionalismo e a imagem do governo por meio da propaganda e do controle dos meios de comunicação. Qual órgão foi criado com essa finalidade?",
    option_a: "Ministério da Educação e Cultura.",
    option_b: "Departamento de Imprensa e Propaganda (DIP).",
    option_c: "Partido Trabalhista Brasileiro (PTB).",
    option_d: "Instituto Brasileiro de Geografia e Estatística (IBGE).",
    option_e: "Banco Nacional de Desenvolvimento Econômico (BNDE).",
    correct_answer: "B",
    theme: "Era Vargas",
    topic: "Estado Novo e o DIP",
    explanation: "O DIP era responsável por censurar a imprensa e produzir material de propaganda para promover a imagem de Vargas e do Estado Novo.",
    difficulty: "Fácil",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "A política trabalhista de Getúlio Vargas, implementada ao longo de sua Era, teve grande impacto na sociedade brasileira. Qual das alternativas abaixo NÃO representa uma característica dessa política?",
    option_a: "Criação da Consolidação das Leis do Trabalho (CLT).",
    option_b: "Legalização dos sindicatos, com forte controle estatal sobre suas atividades.",
    option_c: "Implementação do salário mínimo e da jornada de trabalho de 8 horas.",
    option_d: "Estímulo à livre organização dos trabalhadores, sem interferência do Estado.",
    option_e: "Criação de órgãos de assistência social, como o Instituto de Aposentadoria e Pensões dos Industriários (IAPI).",
    correct_answer: "D",
    theme: "Era Vargas",
    topic: "Política Trabalhista",
    explanation: "A política trabalhista de Vargas era paternalista e controladora, com o Estado intervindo ativamente na organização dos trabalhadores.",
    difficulty: "Médio",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "O movimento conhecido como Queremismo, que ganhou força nos últimos anos do Estado Novo, defendia:",
    option_a: "A imediata redemocratização do país e a deposição de Vargas.",
    option_b: "A continuidade de Vargas no poder, mesmo após o fim do Estado Novo.",
    option_c: "A instauração de uma monarquia parlamentarista no Brasil.",
    option_d: "A entrada do Brasil na Segunda Guerra Mundial ao lado do Eixo.",
    option_e: "A criação de um partido único e a intensificação do autoritarismo.",
    correct_answer: "B",
    theme: "Era Vargas",
    topic: "Queremismo",
    explanation: "O Queremismo, apesar de surgir em um contexto de crise do Estado Novo, buscava a permanência de Vargas na presidência.",
    difficulty: "Fácil",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "Após a deposição de Vargas em 1945, o Brasil passou por um período de redemocratização. Quais foram os dois principais partidos políticos que surgiram nesse contexto, representando, em grande parte, a herança política do varguismo?",
    option_a: "União Democrática Nacional (UDN) e Partido Social Democrático (PSD).",
    option_b: "Partido Trabalhista Brasileiro (PTB) e Partido Social Democrático (PSD).",
    option_c: "Partido Comunista Brasileiro (PCB) e União Democrática Nacional (UDN).",
    option_d: "Partido Trabalhista Brasileiro (PTB) e Partido Comunista Brasileiro (PCB).",
    option_e: "Ação Integralista Brasileira (AIB) e União Democrática Nacional (UDN).",
    correct_answer: "B",
    theme: "Era Vargas",
    topic: "Legado do Varguismo e o Pós-1945",
    explanation: "O PTB, voltado para a classe trabalhadora, e o PSD, com uma base mais heterogênea, foram criados sob a influência de Vargas e seus aliados.",
    difficulty: "Médio",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "Getúlio Vargas retornou ao poder por meio de eleições diretas em 1950, inaugurando seu segundo governo. Qual das alternativas abaixo NÃO caracteriza esse período?",
    option_a: "Criação da Petrobras, símbolo do nacionalismo econômico.",
    option_b: "Intensificação da política de industrialização, com investimentos em setores como siderurgia e energia.",
    option_c: "Aproximação com os Estados Unidos e alinhamento à política externa norte-americana.",
    option_d: "Crescente oposição de setores da imprensa e da classe média, liderada por Carlos Lacerda.",
    option_e: "Clima de instabilidade política, culminando no suicídio de Vargas em 1954.",
    correct_answer: "C",
    theme: "Era Vargas",
    topic: "Segundo Governo Vargas (1951-1954)",
    explanation: "O segundo governo Vargas foi marcado pelo nacionalismo e pelo desenvolvimento, com a criação da Petrobras, mas enfrentou forte oposição interna.",
    difficulty: "Médio",
    is_from_previous_exam: false
  },
  {
    subject: "História do Brasil",
    text: "O suicídio de Getúlio Vargas, em 1954, gerou grande comoção popular. Em sua carta-testamento, Vargas buscava defender seu legado e justificar suas ações. Qual das frases abaixo NÃO está presente na carta-testamento de Vargas?",
    option_a: "\"Saio da vida para entrar na história.\"",
    option_b: "\"Deixo a vida para entrar na imortalidade.\"",
    option_c: "\"Luttei contra a espoliação do Brasil.\"",
    option_d: "\"Vencerei a morte com meu ideal de um Brasil justo e soberano.\"",
    option_e: "\"Lutei pelo povo e pelo país.\"",
    correct_answer: "D",
    theme: "Era Vargas",
    topic: "Suicídio e Carta-Testamento de Vargas",
    explanation: "A frase \"Vencerei a morte com meu ideal de um Brasil justo e soberano\" não faz parte da carta-testamento de Vargas. A alternativa correta apresenta a frase icônica presente na carta. As demais alternativas refletem o conteúdo da carta.",
    difficulty: "Difícil",
    is_from_previous_exam: false
  }
];

export const insertEraVargasQuestions = async () => {
  console.log("Iniciando inserção das questões da Era Vargas...");
  
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) throw error;

    console.log(`${data.length} questões inseridas com sucesso!`);
    return { success: true, count: data.length };
  } catch (error) {
    console.error("Erro ao inserir questões:", error);
    throw error;
  }
};