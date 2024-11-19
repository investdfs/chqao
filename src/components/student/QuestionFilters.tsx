import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuestionFiltersProps {
  selectedSubject: string;
  selectedTopic: string;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  subjects: Array<{
    id: string; // Mudamos de number para string
    name: string;
    topics: string[];
  }>;
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
  subjects,
  onFocusMode,
  isFocusMode,
  questionCount,
  onQuestionCountChange,
  skipCompleted,
  onSkipCompletedChange,
  prioritizeErrors,
  onPrioritizeErrorsChange,
}: QuestionFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Escolha uma matéria" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTopic}
            onValueChange={onTopicChange}
            disabled={!selectedSubject}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Escolha um tópico" />
            </SelectTrigger>
            <SelectContent>
              {subjects
                .find((s) => s.name === selectedSubject)
                ?.topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
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