export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          status: Database["public"]["Enums"]["admin_status"] | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string
          password: string
          status?: Database["public"]["Enums"]["admin_status"] | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          status?: Database["public"]["Enums"]["admin_status"] | null
        }
        Relationships: []
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
          status: Database["public"]["Enums"]["ai_generation_status"] | null
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          error_message?: string | null
          generated_questions?: Json | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["ai_generation_status"] | null
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          error_message?: string | null
          generated_questions?: Json | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["ai_generation_status"] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          difficulty: Database["public"]["Enums"]["question_difficulty"] | null
          exam_name: string | null
          exam_year: number | null
          explanation: string | null
          id: string
          image_url: string | null
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
          difficulty?: Database["public"]["Enums"]["question_difficulty"] | null
          exam_name?: string | null
          exam_year?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
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
          difficulty?: Database["public"]["Enums"]["question_difficulty"] | null
          exam_name?: string | null
          exam_year?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
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
          status: Database["public"]["Enums"]["student_status"] | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string
          password: string
          status?: Database["public"]["Enums"]["student_status"] | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          status?: Database["public"]["Enums"]["student_status"] | null
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
      get_questions_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          subject: string
          theme: string
          topic: string
          count: number
        }[]
      }
      increment_pdf_usage: {
        Args: {
          pdf_path: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
