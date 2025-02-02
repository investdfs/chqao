export interface TopicDifficulty {
  topic: string;
  subject: string;
  performance: number;
  totalQuestions: number;
}

export interface StudyStats {
  totalStudyTime: string;
  consecutiveStudyDays: number;
  weeklyStudyHours: number;
  weeklyQuestionsTarget: number;
  weeklyQuestionsCompleted: number;
}

export interface WeeklyStudyData {
  studyDay: string;
  questionCount: number;
  studyTime: string;
}