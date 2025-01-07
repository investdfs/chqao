export interface StudySession {
  id: string;
  student_id: string;
  correct_answers: number;
  incorrect_answers: number;
  percentage: number;
  created_at: string;
}