import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionFiltersProps {
  subjects: string[];
  topics: string[];
  selectedSubject: string;
  selectedTopic: string;
  searchTerm: string;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilter: () => void;
}

export const QuestionFilters = ({
  subjects,
  topics,
  selectedSubject,
  selectedTopic,
  searchTerm,
  onSubjectChange,
  onTopicChange,
  onSearchChange,
  onFilter,
}: QuestionFiltersProps) => {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por matéria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as matérias</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTopic} onValueChange={onTopicChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por tópico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tópicos</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar questões..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button variant="secondary" onClick={onFilter}>
          Filtrar
        </Button>
      </div>
    </div>
  );
};