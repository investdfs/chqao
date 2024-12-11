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

const availableSubjects = [
  { id: "1", name: "Língua Portuguesa" },
  { id: "2", name: "Geografia do Brasil" },
  { id: "3", name: "História do Brasil" },
  { id: "4", name: "E-1 - Estatuto dos Militares" },
  { id: "5", name: "Licitações e Contratos" },
  { id: "6", name: "Regulamento de Administração do Exército (RAE)" },
  { id: "7", name: "Direito Militar e Sindicância" },
  { id: "8", name: "Código Penal Militar" },
  { id: "9", name: "Código de Processo Penal Militar" },
  { id: "10", name: "Sindicância" },
  { id: "11", name: "Conhecimentos Musicais Gerais" },
  { id: "12", name: "Harmonia Elementar (vocal) e Funcional (instrumental)" },
  { id: "13", name: "Períodos da História da Música" },
  { id: "14", name: "Instrumentação" },
  { id: "15", name: "Canto Modulante" },
  { id: "16", name: "Transcrição" },
];

const questionTypeOptions = [
  { id: "all", name: "Todas as questões" },
  { id: "hidden", name: "Questões ocultas" },
  { id: "exam", name: "Questões de provas" },
  { id: "new", name: "Questões inéditas" },
];

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
          <SelectContent className="bg-white">
            <SelectItem value="">Todas</SelectItem>
            {availableSubjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
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
          <SelectContent className="bg-white">
            <SelectItem value="">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Selecionar</Label>
        <Select 
          value={filters.searchTerm} 
          onValueChange={(value) => onFilterChange("searchTerm", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de questão" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {questionTypeOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};