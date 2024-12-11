import { Question } from './types.ts';

export function validateGeneratedQuestions(questions: Question[], expectedCount: number) {
  if (!Array.isArray(questions)) {
    throw new Error('Resposta da IA não é um array');
  }

  if (questions.length !== expectedCount) {
    throw new Error(`Número incorreto de questões geradas. Esperado: ${expectedCount}, Recebido: ${questions.length}`);
  }

  questions.forEach((q, index) => {
    const requiredFields = [
      'text', 'option_a', 'option_b', 'option_c', 'option_d', 
      'option_e', 'correct_answer', 'explanation', 'difficulty', 
      'subject', 'theme', 'topic'
    ];
    
    const missingFields = requiredFields.filter(field => !q[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Questão ${index + 1} está faltando campos obrigatórios: ${missingFields.join(', ')}`);
    }

    if (!['A', 'B', 'C', 'D', 'E'].includes(q.correct_answer)) {
      throw new Error(`Questão ${index + 1} tem resposta inválida: ${q.correct_answer}`);
    }

    if (!['Fácil', 'Médio', 'Difícil'].includes(q.difficulty)) {
      throw new Error(`Questão ${index + 1} tem dificuldade inválida: ${q.difficulty}`);
    }

    if (q.text.length < 20) {
      throw new Error(`Questão ${index + 1} tem texto muito curto`);
    }

    if (q.explanation.length < 30) {
      throw new Error(`Questão ${index + 1} tem explicação muito curta`);
    }

    // Marca todas as questões como geradas por IA
    q.is_ai_generated = true;
  });

  return questions;
}