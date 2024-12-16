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
  secondary_id?: string;
  exam_year?: number;
  is_from_previous_exam?: boolean;
  source?: string;
}

export interface FormattedQuestion {
  id: string;
  text: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  subject?: string;
  topic?: string;
  source?: string;
  secondaryId?: string;
  examYear?: number;
  isFromPreviousExam?: boolean;
}