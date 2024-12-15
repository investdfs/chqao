import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubjectSelect } from "./question/filters/SubjectSelect";
import { ThemeSelect } from "./question/filters/ThemeSelect";
import { TopicSelect } from "./question/filters/TopicSelect";
import { QuestionCountSelect } from "./question/filters/QuestionCountSelect";
import { StudyOptions } from "./question/filters/StudyOptions";

interface QuestionFiltersProps {
  selectedSubject: string;
  selectedTopic: string;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onFocusMode: () => void;
  isFocusMode: boolean;
  questionCount: number;
  onQuestionCountChange: (value: string) => void;
  skipCompleted: boolean;
  onSkipCompletedChange: (checked: boolean) => void;
  prioritizeErrors: boolean;
  onPrioritizeErrorsChange: (checked: boolean) => void;
}

const QuestionFilters = ({
  selectedSubject,
  selectedTopic,
  onSubjectChange,
  onTopicChange,
  onFocusMode,
  isFocusMode,
  questionCount,
  onQuestionCountChange,
  skipCompleted,
  onSkipCompletedChange,
  prioritizeErrors,
  onPrioritizeErrorsChange,
}: QuestionFiltersProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const { data: subjectStructure } = useQuery({
    queryKey: ['subject-hierarchy'],
    queryFn: async () => {
      console.log("Fetching subject hierarchy...");
      const { data, error } = await supabase.rpc('get_subject_hierarchy');
      
      if (error) {
        console.error("Error fetching subject hierarchy:", error);
        throw error;
      }
      
      console.log("Subject hierarchy data:", data);
      return data;
    }
  });

  const subjects = subjectStructure?.filter(node => node.level === 1) || [];
  const themes = subjectStructure?.filter(node => {
    const parentNode = subjectStructure.find(s => s.name === selectedSubject);
    return node.level === 2 && node.parent_id === parentNode?.id;
  }) || [];
  const topics = subjectStructure?.filter(node => {
    const parentNode = subjectStructure.find(s => s.name === selectedTheme);
    return node.level === 3 && node.parent_id === parentNode?.id;
  }) || [];

  useEffect(() => {
    if (selectedSubject === "") {
      setSelectedTheme("");
      onTopicChange("");
    }
  }, [selectedSubject, onTopicChange]);

  useEffect(() => {
    if (selectedTheme === "") {
      onTopicChange("");
    }
  }, [selectedTheme, onTopicChange]);

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
          <SubjectSelect
            value={selectedSubject}
            onChange={onSubjectChange}
            subjects={subjects}
          />

          <ThemeSelect
            value={selectedTheme}
            onChange={setSelectedTheme}
            themes={themes}
            disabled={!selectedSubject}
          />

          <TopicSelect
            value={selectedTopic}
            onChange={onTopicChange}
            topics={topics}
            disabled={!selectedTheme}
          />

          <QuestionCountSelect
            value={String(questionCount)}
            onChange={onQuestionCountChange}
          />
        </div>

        <Button 
          variant={isFocusMode ? "default" : "outline"}
          onClick={onFocusMode}
          className="w-full lg:w-auto"
        >
          {isFocusMode ? "Desativar Foco" : "Ativar Foco"}
        </Button>
      </div>

      <StudyOptions
        skipCompleted={skipCompleted}
        onSkipCompletedChange={onSkipCompletedChange}
        prioritizeErrors={prioritizeErrors}
        onPrioritizeErrorsChange={onPrioritizeErrorsChange}
      />
    </div>
  );
};

export default QuestionFilters;