import { useQuestionImporterState } from "@/hooks/useQuestionImporterState";
import { useQuestionImporterQueries } from "@/hooks/useQuestionImporterQueries";

export const useQuestionImporter = () => {
  const state = useQuestionImporterState();
  const queries = useQuestionImporterQueries();

  const fetchThemesSubjectsAndTopics = async () => {
    const result = await queries.fetchThemesSubjectsAndTopics();
    if (result) {
      state.setThemes(result.uniqueThemes);
      state.setSubjects(result.uniqueSubjects);
      state.setTopics(result.uniqueTopics);
    }
  };

  const fetchQuestions = async () => {
    const questions = await queries.fetchQuestions({
      searchTerm: state.searchTerm,
      selectedTheme: state.selectedTheme,
      selectedSubject: state.selectedSubject,
      selectedTopic: state.selectedTopic,
    });
    if (questions) {
      state.setQuestions(questions);
    }
  };

  const handleResetDatabase = async () => {
    const success = await queries.handleResetDatabase();
    if (success) {
      state.setQuestions([]);
      state.setShowResetDialog(false);
    }
  };

  return {
    ...state,
    fetchQuestions,
    fetchThemesSubjectsAndTopics,
    handleResetDatabase,
  };
};