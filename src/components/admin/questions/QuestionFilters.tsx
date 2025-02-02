import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionFiltersProps {
  filters: {
    subject: string;
    topic: string;
    searchTerm: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

export const QuestionFilters = ({ filters, onFilterChange }: QuestionFiltersProps) => {
  const { data: subjects } = useQuery({
    queryKey: ['subject-structure-subjects'],
    queryFn: async () => {
      console.log('Buscando matérias do banco...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('level', 1)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    }
  });

  const { data: topics } = useQuery({
    queryKey: ['subject-structure-topics', filters.subject],
    queryFn: async () => {
      if (!filters.subject) return [];

      console.log('Buscando tópicos do banco...');
      const parentNode = await supabase
        .from('subject_structure')
        .select('id')
        .eq('name', filters.subject)
        .single();

      if (!parentNode.data) return [];

      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('parent_id', parentNode.data.id)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    },
    enabled: !!filters.subject
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Matéria</Label>
          {filters.subject ? (
            <ToggleRight className="h-4 w-4 text-primary" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Select 
          value={filters.subject} 
          onValueChange={(value) => onFilterChange("subject", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a matéria" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="">Todas</SelectItem>
            {subjects?.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Tópico</Label>
          {filters.topic ? (
            <ToggleRight className="h-4 w-4 text-primary" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Select 
          value={filters.topic} 
          onValueChange={(value) => onFilterChange("topic", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tópico" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="">Todos</SelectItem>
            {topics?.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Selecionar</Label>
          {filters.searchTerm !== "all" ? (
            <ToggleRight className="h-4 w-4 text-primary" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Select 
          value={filters.searchTerm} 
          onValueChange={(value) => onFilterChange("searchTerm", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de questão" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Todas as questões</SelectItem>
            <SelectItem value="hidden">Questões ocultas</SelectItem>
            <SelectItem value="exam">Questões de provas</SelectItem>
            <SelectItem value="new">Questões inéditas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};