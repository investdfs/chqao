import { Database } from '@/integrations/supabase/types';

// Tipos para inserção/atualização de tabelas específicas
export type StudentInsert = Database['public']['Tables']['students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['students']['Update'];

export type AdminInsert = Database['public']['Tables']['admins']['Insert'];
export type AdminUpdate = Database['public']['Tables']['admins']['Update'];

export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
export type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export type QuestionAnswerInsert = Database['public']['Tables']['question_answers']['Insert'];
export type QuestionAnswerUpdate = Database['public']['Tables']['question_answers']['Update'];

export type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert'];
export type StudySessionUpdate = Database['public']['Tables']['study_sessions']['Update'];

export type UploadedPdfInsert = Database['public']['Tables']['uploaded_pdfs']['Insert'];
export type UploadedPdfUpdate = Database['public']['Tables']['uploaded_pdfs']['Update'];

// Tipos para enums
export type AdminStatus = Database['public']['Enums']['admin_status'];
export type StudentStatus = Database['public']['Enums']['student_status'];
export type QuestionDifficulty = Database['public']['Enums']['question_difficulty'];

// Tipos para funções RPC
export type GetAnswerCountsReturn = Database['public']['Functions']['get_answer_counts']['Returns'];
export type GetStudyStatsReturn = Database['public']['Functions']['get_study_stats']['Returns'];
export type GetTopicRecommendationsReturn = Database['public']['Functions']['get_topic_recommendations']['Returns'];
export type GetSubjectHierarchyReturn = Database['public']['Functions']['get_subject_hierarchy']['Returns'];
export type GetQuestionsStatsReturn = Database['public']['Functions']['get_questions_stats']['Returns'];

// Helper para extrair tipo de retorno de queries
export type PostgrestSingleResponse<T> = T extends Array<infer U> ? U : T;