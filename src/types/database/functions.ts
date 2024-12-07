export interface AnswerCount {
  option_letter: string;
  count: number;
}

export interface QuestionStats {
  subject: string;
  theme: string;
  topic: string;
  count: number;
}

export interface StudentPerformance {
  subject: string;
  questions_answered: number;
  correct_answers: number;
}

export interface StudyStats {
  total_study_time: string;
  consecutive_study_days: number;
  weekly_study_hours: number;
  weekly_questions_target: number;
  weekly_questions_completed: number;
}

export interface SyllabusProgress {
  completed_topics: number;
  pending_topics: number;
  progress_percentage: number;
}

export interface WeeklyStudyData {
  study_day: string;
  question_count: number;
  study_time: string;
}