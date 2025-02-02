import { useState } from "react";
import { QuestionImporterState } from "@/types/questions/importer";

export const useQuestionImporterState = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("all");
  const [showResetDialog, setShowResetDialog] = useState(false);

  return {
    state: {
      questions,
      showQuestions,
      themes,
      subjects,
      topics,
      selectedTheme,
      selectedSubject,
      selectedTopic,
      searchTerm,
      showResetDialog,
    } as QuestionImporterState,
    setters: {
      setQuestions,
      setShowQuestions,
      setThemes,
      setSubjects,
      setTopics,
      setSelectedTheme,
      setSelectedSubject,
      setSelectedTopic,
      setSearchTerm,
      setShowResetDialog,
    },
  };
};