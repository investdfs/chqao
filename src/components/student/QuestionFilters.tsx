import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

interface SubjectNode {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
  has_children: boolean;
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

  // Fetch hierarchical structure
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
      return data as SubjectNode[];
    }
  });

  // Filter subjects (level 1)
  const subjects = subjectStructure?.filter(node => node.level === 1) || [];
  
  // Filter themes (level 2) based on selected subject
  const themes = subjectStructure?.filter(node => {
    const parentNode = subjectStructure.find(s => s.name === selectedSubject);
    return node.level === 2 && node.parent_id === parentNode?.id;
  }) || [];
  
  // Filter topics (level 3) based on selected theme
  const topics = subjectStructure?.filter(node => {
    const parentNode = subjectStructure.find(s => s.name === selectedTheme);
    return node.level === 3 && node.parent_id === parentNode?.id;
  }) || [];

  // Reset child selections when parent changes
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
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Escolha uma matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as matérias</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedTheme} 
            onValueChange={setSelectedTheme}
            disabled={!selectedSubject}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Escolha um tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os temas</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.name}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTopic}
            onValueChange={onTopicChange}
            disabled={!selectedTheme}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Escolha um tópico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tópicos</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.name}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(questionCount)} onValueChange={onQuestionCountChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Número de questões" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count} questões
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant={isFocusMode ? "default" : "outline"}
          onClick={onFocusMode}
          className="w-full lg:w-auto"
        >
          {isFocusMode ? "Desativar Foco" : "Ativar Foco"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="skipCompleted"
            checked={skipCompleted}
            onCheckedChange={onSkipCompletedChange}
          />
          <Label htmlFor="skipCompleted" className="text-sm sm:text-base">
            Pular questões já realizadas
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="prioritizeErrors"
            checked={prioritizeErrors}
            onCheckedChange={onPrioritizeErrorsChange}
          />
          <Label htmlFor="prioritizeErrors" className="text-sm sm:text-base">
            Priorizar questões erradas
          </Label>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilters;