export interface Question {
  id: string;
  subject: string;
  topic?: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation?: string;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  created_at: string;
  image_url?: string;
  theme?: string;
  is_ai_generated?: boolean;
  status?: string;
}

export interface PreviousExam {
  id: string;
  year: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface PreviousExamQuestion {
  id: string;
  exam_id: string;
  subject: string;
  topic?: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation?: string;
  created_at: string;
}