import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResetExamFiltersProps {
  selectedYear: string;
  selectedSubject: string;
  availableYears: number[];
  availableSubjects: string[];
  onYearChange: (year: string) => void;
  onSubjectChange: (subject: string) => void;
}

export const ResetExamFilters = ({
  selectedYear,
  selectedSubject,
  availableYears,
  availableSubjects,
  onYearChange,
  onSubjectChange,
}: ResetExamFiltersProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="year">Ano</Label>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger id="year">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedYear && (
        <div className="space-y-2">
          <Label htmlFor="subject">Matéria (opcional)</Label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as matérias</SelectItem>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};