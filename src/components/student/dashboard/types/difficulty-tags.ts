export interface TopicDifficulty {
  topic: string;
  subject: string;
  performance: number;
  totalQuestions: number;
}

export interface DifficultyInfo {
  color: string;
  iconType: 'trending-up' | 'target' | 'trending-down';
  label: string;
}

export interface DifficultyTagsProps {
  userId?: string;
}