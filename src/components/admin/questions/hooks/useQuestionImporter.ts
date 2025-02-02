import { useQuestionImporterState } from "./useQuestionImporterState";
import { useQuestionImporterQueries } from "./useQuestionImporterQueries";
import { QuestionFilters } from "@/types/questions/importer";

export const useQuestionImporter = () => {
  const { state, setters } = useQuestionImporterState();
  const { fetchQuestions, fetchThemesSubjectsAndTopics, handleResetDatabase } = useQuestionImporterQueries();

  const updateQuestions = async () => {
    const filters: QuestionFilters = {
      searchTerm: state.searchTerm,
      selectedTheme: state.selectedTheme,
      selectedSubject: state.selectedSubject,
      selectedTopic: state.selectedTopic,
    };

    const questions = await fetchQuestions(filters);
    setters.setQuestions(questions);
  };

  const updateStructure = async () => {
    const data = await fetchThemesSubjectsAndTopics();
    if (data) {
      const themes = [...new Set(data.map(item => item.theme))];
      const subjects = [...new Set(data.map(item => item.subject))];
      const topics = [...new Set(data.map(item => item.topic))];
      
      setters.setThemes(themes);
      setters.setSubjects(subjects);
      setters.setTopics(topics);
    }
  };

  const resetDatabase = async () => {
    const success = await handleResetDatabase();
    if (success) {
      setters.setShowResetDialog(false);
      setters.setQuestions([]);
    }
  };

  return {
    ...state,
    ...setters,
    fetchQuestions: updateQuestions,
    fetchThemesSubjectsAndTopics: updateStructure,
    handleResetDatabase: resetDatabase,
  };
};