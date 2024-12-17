import { Question } from "@/types/questions/common";

export interface NewQuestionFormat {
  questao: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  opcao_e: string;
  resposta_correta: string;
  comentario: string;
  nivel: "Fácil" | "Médio" | "Difícil";
  materia: string;
  assunto: string;
  tipo: string;
  questao_de_prova_anterior: "sim" | "nao";
  ano_exame: number | null;
}

export const convertNewToOldFormat = (newQuestion: NewQuestionFormat): Question => {
  console.log("Convertendo questão do novo formato para o antigo:", newQuestion);
  
  return {
    text: newQuestion.questao,
    option_a: newQuestion.opcao_a,
    option_b: newQuestion.opcao_b,
    option_c: newQuestion.opcao_c,
    option_d: newQuestion.opcao_d,
    option_e: newQuestion.opcao_e,
    correct_answer: newQuestion.resposta_correta,
    explanation: newQuestion.comentario,
    difficulty: newQuestion.nivel,
    theme: newQuestion.materia,
    subject: newQuestion.assunto,
    topic: newQuestion.tipo,
    is_from_previous_exam: newQuestion.questao_de_prova_anterior === "sim",
    exam_year: newQuestion.ano_exame,
    status: 'active'
  };
};

export const convertOldToNewFormat = (oldQuestion: Question): NewQuestionFormat => {
  console.log("Convertendo questão do formato antigo para o novo:", oldQuestion);
  
  return {
    questao: oldQuestion.text,
    opcao_a: oldQuestion.option_a,
    opcao_b: oldQuestion.option_b,
    opcao_c: oldQuestion.option_c,
    opcao_d: oldQuestion.option_d,
    opcao_e: oldQuestion.option_e,
    resposta_correta: oldQuestion.correct_answer,
    comentario: oldQuestion.explanation || "",
    nivel: oldQuestion.difficulty || "Médio",
    materia: oldQuestion.theme || "",
    assunto: oldQuestion.subject,
    tipo: oldQuestion.topic || "Questão Inédita",
    questao_de_prova_anterior: oldQuestion.is_from_previous_exam ? "sim" : "nao",
    ano_exame: oldQuestion.exam_year
  };
};

export const validateNewFormat = (question: any): question is NewQuestionFormat => {
  console.log("Validando questão no novo formato:", question);
  
  const requiredFields = [
    'questao',
    'opcao_a',
    'opcao_b',
    'opcao_c',
    'opcao_d',
    'opcao_e',
    'resposta_correta',
    'materia',
    'assunto'
  ];

  const missingFields = requiredFields.filter(field => !question[field]);
  
  if (missingFields.length > 0) {
    console.error("Campos obrigatórios faltando:", missingFields);
    return false;
  }

  if (question.nivel && !["Fácil", "Médio", "Difícil"].includes(question.nivel)) {
    console.error("Nível inválido:", question.nivel);
    return false;
  }

  if (question.resposta_correta && !["A", "B", "C", "D", "E"].includes(question.resposta_correta)) {
    console.error("Resposta correta inválida:", question.resposta_correta);
    return false;
  }

  return true;
};