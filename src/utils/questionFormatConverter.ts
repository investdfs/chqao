import { Question } from "@/types/questions/common";

export interface NewQuestionFormat {
  subject: string;           // antes era tema
  topic: string;            // antes era assunto
  text: string;            // antes era questao
  option_a: string;        // antes era opcaoA
  option_b: string;        // antes era opcaoB
  option_c: string;        // antes era opcaoC
  option_d: string;        // antes era opcaoD
  option_e: string;        // antes era opcaoE
  correct_answer: string;  // antes era resposta
  explanation: string;     // antes era explicacao
  difficulty: "Fácil" | "Médio" | "Difícil";
  is_from_previous_exam: boolean;  // antes era concursoAnterior
  exam_year: number | null;       // antes era ano
  exam_name: string | null;      // antes era nome
  image_url?: string | null;    // antes era imagem
}

export const convertNewToOldFormat = (newQuestion: NewQuestionFormat): Partial<Question> => {
  console.log("Convertendo questão do novo formato para o antigo:", newQuestion);
  
  return {
    text: newQuestion.text,
    option_a: newQuestion.option_a,
    option_b: newQuestion.option_b,
    option_c: newQuestion.option_c,
    option_d: newQuestion.option_d,
    option_e: newQuestion.option_e,
    correct_answer: newQuestion.correct_answer,
    explanation: newQuestion.explanation,
    difficulty: newQuestion.difficulty,
    subject: newQuestion.subject,
    topic: newQuestion.topic,
    is_from_previous_exam: newQuestion.is_from_previous_exam,
    exam_year: newQuestion.exam_year,
    exam_name: newQuestion.exam_name,
    image_url: newQuestion.image_url,
    status: 'active'
  };
};

export const validateNewFormat = (question: any): question is NewQuestionFormat => {
  console.log("Validando questão no novo formato:", question);
  
  const requiredFields = [
    'subject',
    'topic',
    'text',
    'option_a',
    'option_b',
    'option_c',
    'option_d',
    'option_e',
    'correct_answer',
    'explanation'
  ];

  const missingFields = requiredFields.filter(field => !question[field]);
  
  if (missingFields.length > 0) {
    console.error("Campos obrigatórios faltando:", missingFields);
    return false;
  }

  if (question.difficulty && !["Fácil", "Médio", "Difícil"].includes(question.difficulty)) {
    console.error("Nível inválido:", question.difficulty);
    return false;
  }

  if (question.correct_answer && !["A", "B", "C", "D", "E"].includes(question.correct_answer)) {
    console.error("Resposta correta inválida:", question.correct_answer);
    return false;
  }

  return true;
};