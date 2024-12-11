export interface Question {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  theme: string | null;
  is_ai_generated: boolean;
}

export interface ProcessPdfRequest {
  generationId: string;
  filePath: string;
  questionCount: number;
  customInstructions?: string;
  subject: string;
  theme?: string | null;
}