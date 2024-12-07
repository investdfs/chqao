export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          status: "active" | "blocked" | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string
          password: string
          status?: "active" | "blocked" | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          status?: "active" | "blocked" | null
        }
      }
      ai_question_generations: {
        Row: {
          completed_at: string | null
          content: string
          created_at: string
          error_message: string | null
          generated_questions: Json | null
          id: string
          metadata: Json | null
          status: "pending" | "processing" | "completed" | "failed" | null
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          error_message?: string | null
          generated_questions?: Json | null
          id?: string
          metadata?: Json | null
          status?: "pending" | "processing" | "completed" | "failed" | null
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          error_message?: string | null
          generated_questions?: Json | null
          id?: string
          metadata?: Json | null
          status?: "pending" | "processing" | "completed" | "failed" | null
        }
      }
      question_answers: {
        Row: {
          created_at: string
          id: string
          question_id: string
          selected_option: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          selected_option: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          selected_option?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: "Fácil" | "Médio" | "Difícil" | null
          exam_name: string | null
          exam_year: number | null
          explanation: string | null
          id: string
          image_url: string | null
          is_ai_generated: boolean | null
          is_from_previous_exam: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          option_e: string
          subject: string
          subject_matter: string | null
          text: string
          theme: string | null
          topic: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          difficulty?: "Fácil" | "Médio" | "Difícil" | null
          exam_name?: string | null
          exam_year?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_from_previous_exam?: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          option_e: string
          subject: string
          subject_matter?: string | null
          text: string
          theme?: string | null
          topic?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          difficulty?: "Fácil" | "Médio" | "Difícil" | null
          exam_name?: string | null
          exam_year?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_from_previous_exam?: boolean | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          option_e?: string
          subject?: string
          subject_matter?: string | null
          text?: string
          theme?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          status: "active" | "blocked" | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          status?: "active" | "blocked" | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          status?: "active" | "blocked" | null
        }
        Relationships: []
      }
      subject_structure: {
        Row: {
          created_at: string | null
          id: string
          subject: string
          theme: string
          topic: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subject: string
          theme: string
          topic: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subject?: string
          theme?: string
          topic?: string
        }
        Relationships: []
      }
      uploaded_pdfs: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          filename: string
          id: string
          subject: string | null
          times_used: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          filename: string
          id?: string
          subject?: string | null
          times_used?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          filename?: string
          id?: string
          subject?: string | null
          times_used?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_answer_counts: {
        Args: { question_id: string }
        Returns: Array<{
          option_letter: string
          count: number
        }>
      }
      get_questions_stats: {
        Args: Record<string, never>
        Returns: Array<{
          subject: string
          theme: string
          topic: string
          count: number
        }>
      }
      get_student_performance: {
        Args: { student_id_param: string }
        Returns: Array<{
          subject: string
          questions_answered: number
          correct_answers: number
        }>
      }
      get_study_stats: {
        Args: { student_id_param: string }
        Returns: Array<{
          total_study_time: string
          consecutive_study_days: number
          weekly_study_hours: number
          weekly_questions_target: number
          weekly_questions_completed: number
        }>
      }
      get_syllabus_progress: {
        Args: { student_id_param: string }
        Returns: Array<{
          completed_topics: number
          pending_topics: number
          progress_percentage: number
        }>
      }
      get_weekly_study_data: {
        Args: { student_id_param: string }
        Returns: Array<{
          study_day: string
          question_count: number
          study_time: string
        }>
      }
      increment_pdf_usage: {
        Args: { pdf_path: string }
        Returns: undefined
      }
      reset_student_progress: {
        Args: { student_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      admin_status: "active" | "blocked"
      ai_generation_status: "pending" | "processing" | "completed" | "failed"
      question_difficulty: "Fácil" | "Médio" | "Difícil"
      student_status: "active" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
