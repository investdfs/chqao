export interface TopicDifficulty {
  topic: string;
  subject: string;
  performance: number;
  totalQuestions: number;
}

export interface DifficultyInfo {
  color: string;
  icon: JSX.Element;
  label: string;
}

export interface DifficultyTagsProps {
  userId?: string;
}