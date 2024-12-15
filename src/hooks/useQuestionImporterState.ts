import { useState } from "react";

export const useQuestionImporterState = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("all");
  const [showResetDialog, setShowResetDialog] = useState(false);

  return {
    questions,
    setQuestions,
    showQuestions,
    setShowQuestions,
    themes,
    setThemes,
    subjects,
    setSubjects,
    topics,
    setTopics,
    selectedTheme,
    setSelectedTheme,
    selectedSubject,
    setSelectedSubject,
    selectedTopic,
    setSelectedTopic,
    searchTerm,
    setSearchTerm,
    showResetDialog,
    setShowResetDialog,
  };
};