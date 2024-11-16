import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionFiltersProps {
  selectedSubject: string;
  selectedTopic: string;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  subjects: Array<{
    id: number;
    name: string;
    topics: string[];
  }>;
  onFocusMode: () => void;
  isFocusMode: boolean;
}

const QuestionFilters = ({
  selectedSubject,
  selectedTopic,
  onSubjectChange,
  onTopicChange,
  subjects,
  onFocusMode,
  isFocusMode,
}: QuestionFiltersProps) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <div className="flex items-center gap-4">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-[200px]">
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
          <SelectTrigger className="w-[200px]">
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
      </div>

      <Button 
        variant={isFocusMode ? "default" : "outline"}
        onClick={onFocusMode}
      >
        {isFocusMode ? "Desativar Foco" : "Ativar Foco"}
      </Button>
    </div>
  );
};

export default QuestionFilters;