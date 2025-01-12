import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/questions/common";

export const transformToQuestion = (validatedData: any): Partial<Question> => {
  return {
    theme: validatedData.tema,
    topic: validatedData.assunto,
    text: validatedData.questao,
    image_url: validatedData.imagem || null,
    option_a: validatedData.opcaoA,
    option_b: validatedData.opcaoB,
    option_c: validatedData.opcaoC,
    option_d: validatedData.opcaoD,
    option_e: validatedData.opcaoE,
    correct_answer: validatedData.resposta,
    explanation: validatedData.explicacao,
    difficulty: validatedData.dificuldade,
    is_from_previous_exam: validatedData.concursoAnterior?.toLowerCase() === 'sim',
    exam_year: validatedData.ano || null,
    exam_name: validatedData.nome || null,
    status: 'active'
  };
};

export const insertQuestionBatch = async (questions: Partial<Question>[]) => {
  console.log(`Inserindo lote de ${questions.length} questões...`);
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();

  if (error) {
    console.error('Erro ao inserir lote:', error);
    throw error;
  }

  return data;
};