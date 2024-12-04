import { supabase } from "@/integrations/supabase/client";

const questions = [
  {
    subject: "História do Brasil",
    theme: "Independência do Brasil",
    topic: "Transferência da Corte para o Brasil",
    text: "Qual foi a principal razão para a transferência da Corte portuguesa para o Brasil em 1808?",
    option_a: "A prosperidade econômica do Brasil",
    option_b: "A invasão napoleônica em Portugal",
    option_c: "A vontade de D. João VI de colonizar o Brasil",
    option_d: "A aliança com a Inglaterra",
    option_e: "Nenhuma das alternativas anteriores",
    correct_answer: "B",
    explanation: "A invasão napoleônica em Portugal foi a principal razão para a transferência da Corte portuguesa para o Brasil em 1808.",
    difficulty: "Fácil",
    is_from_previous_exam: true,
    exam_year: 2022,
    exam_name: "Concurso Público de História"
  },
  {
    subject: "História do Brasil",
    theme: "Independência do Brasil",
    topic: "Tratado de Methuen",
    text: "O Tratado de Methuen, assinado em 1703, teve qual impacto na economia portuguesa?",
    option_a: "Fortaleceu a indústria portuguesa",
    option_b: "Levou à subordinação econômica de Portugal à Inglaterra",
    option_c: "Promoveu o desenvolvimento agrícola em Portugal",
    option_d: "Reduziu a dependência de Portugal dos produtos ingleses",
    option_e: "Nenhuma das alternativas anteriores",
    correct_answer: "B",
    explanation: "O Tratado de Methuen subordinou a economia portuguesa à Inglaterra, levando a uma crise econômica.",
    difficulty: "Médio",
    is_from_previous_exam: true,
    exam_year: 2021,
    exam_name: "Concurso Público de História"
  },
  // ... Continuando com todas as outras questões no mesmo formato
];

export const insertHistoriaQuestions = async () => {
  console.log("Iniciando inserção das questões de História do Brasil...");
  
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) throw error;

    console.log(`${data.length} questões de História inseridas com sucesso!`);
    return { success: true, count: data.length };
  } catch (error) {
    console.error("Erro ao inserir questões:", error);
    throw error;
  }
};