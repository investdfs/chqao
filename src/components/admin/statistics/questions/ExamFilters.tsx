import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  years: number[];
  subjects: string[];
}

const availableSubjects = [
  "Língua Portuguesa",
  "Geografia do Brasil",
  "História do Brasil",
  "Estatuto dos Militares",
  "Licitações e Contratos",
  "Regulamento de Administração do Exército (RAE)",
  "Direito Militar e Sindicância no Âmbito do Exército Brasileiro",
  "Código Penal Militar",
  "Código de Processo Penal Militar"
];

export const ExamFilters = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedSubject,
  onSubjectChange,
  years,
}: ExamFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar questões..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedSubject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Filtrar por matéria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as matérias</SelectItem>
          {availableSubjects.map(subject => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os anos</SelectItem>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {`Concurso: EIPS/CHQAO ${year}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};