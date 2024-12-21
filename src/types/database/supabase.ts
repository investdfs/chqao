import { Database } from '@/integrations/supabase/types';

// Tipos para tabelas específicas
export type Tables = Database['public']['Tables'];

// Tipos para inserção
export type AdminInsert = Tables['admins']['Insert'];
export type StudentInsert = Tables['students']['Insert'];
export type QuestionInsert = Tables['questions']['Insert'];
export type QuestionAnswerInsert = Tables['question_answers']['Insert'];
export type UploadedPdfInsert = Tables['uploaded_pdfs']['Insert'];
export type AiQuestionGenerationInsert = Tables['ai_question_generations']['Insert'];

// Tipos para atualização
export type AdminUpdate = Tables['admins']['Update'];
export type StudentUpdate = Tables['students']['Update'];
export type QuestionUpdate = Tables['questions']['Update'];
export type QuestionAnswerUpdate = Tables['question_answers']['Update'];

// Tipos para retornos de funções
export type GetAnswerCountsReturn = Database['public']['Functions']['get_answer_counts']['Returns'] extends unknown[] 
  ? Array<{
      option_letter: string;
      count: number;
    }>
  : never;

export type GetQuestionsStatsReturn = Database['public']['Functions']['get_questions_stats']['Returns'] extends unknown[]
  ? Array<{
      subject: string;
      theme: string;
      topic: string;
      count: number;
    }>
  : never;

export type GetSubjectHierarchyReturn = Database['public']['Functions']['get_subject_hierarchy']['Returns'] extends unknown[]
  ? Array<{
      id: string;
      name: string;
      level: number;
      parent_id: string | null;
      display_order: number;
      has_children: boolean;
    }>
  : never;

// Tipos para enums
export type AdminStatus = Database['public']['Enums']['admin_status'];
export type StudentStatus = Database['public']['Enums']['student_status'];
export type QuestionDifficulty = Database['public']['Enums']['question_difficulty'];
export type UpdateType = Database['public']['Enums']['update_type'];