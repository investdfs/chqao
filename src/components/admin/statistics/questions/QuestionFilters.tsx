import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionFiltersProps {
  filters: {
    subject: string;
    topic: string;
    searchTerm: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

export const QuestionFilters = ({ filters, onFilterChange }: QuestionFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Matéria</Label>
        <Select 
          value={filters.subject} 
          onValueChange={(value) => onFilterChange("subject", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a matéria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {/* We'll populate this dynamically later */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tópico</Label>
        <Select 
          value={filters.topic} 
          onValueChange={(value) => onFilterChange("topic", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tópico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {/* We'll populate this dynamically later */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Buscar</Label>
        <Input
          placeholder="Pesquisar questões..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
        />
      </div>
    </div>
  );
};