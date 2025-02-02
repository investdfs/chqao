export interface QuestionImporterState {
  questions: any[];
  showQuestions: boolean;
  themes: string[];
  subjects: string[];
  topics: string[];
  selectedTheme: string;
  selectedSubject: string;
  selectedTopic: string;
  searchTerm: string;
  showResetDialog: boolean;
}

export interface QuestionFilters {
  searchTerm: string;
  selectedTheme: string;
  selectedSubject: string;
  selectedTopic: string;
}