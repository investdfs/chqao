export interface ExamQuestion {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
  theme: string;
  subject: string;
  topic: string;
}

export interface ExamFormData {
  examYear: string;
  examName: string;
  questions: string;
}