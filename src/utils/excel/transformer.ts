import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/questions/common";

export interface ValidatedData {
  tema: string;
  assunto: string;
  questao: string;
  imagem?: string;
  opcaoA: string;
  opcaoB: string;
  opcaoC: string;
  opcaoD: string;
  opcaoE: string;
  resposta: string;
  explicacao: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  concursoAnterior?: string;
  ano?: number;
  nome?: string;
}

export const transformToQuestion = (validatedData: ValidatedData): Question => {
  return {
    id: '', // Será gerado pelo Supabase
    subject: '', // Será definido com base no nome da aba
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
    status: 'active',
    created_at: new Date().toISOString(),
    theme: validatedData.tema
  };
};

export const insertQuestionBatch = async (questions: Question[]) => {
  console.log(`Inserindo lote de ${questions.length} questões...`);
  
  const completeQuestions = questions.map(question => ({
    ...question,
    subject: question.subject || '',
    text: question.text || '',
    option_a: question.option_a || '',
    option_b: question.option_b || '',
    option_c: question.option_c || '',
    option_d: question.option_d || '',
    option_e: question.option_e || '',
    correct_answer: question.correct_answer || '',
    explanation: question.explanation || '',
    status: question.status || 'active',
    theme: question.theme || null
  }));

  const { data, error } = await supabase
    .from('questions')
    .insert(completeQuestions)
    .select();

  if (error) {
    console.error('Erro ao inserir lote:', error);
    throw error;
  }

  return data;
};