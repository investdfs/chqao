import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamFiltersProps {
  selectedYear: string | null;
  onYearSelect: (year: string | null) => void;
}

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export const ExamFilters = ({
  selectedYear,
  onYearSelect,
}: ExamFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={selectedYear || undefined} onValueChange={onYearSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os anos</SelectItem>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};