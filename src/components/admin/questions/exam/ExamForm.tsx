import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamFormProps {
  examYear: string;
  examName: string;
  questions: string;
  onExamYearChange: (value: string) => void;
  onExamNameChange: (value: string) => void;
  onQuestionsChange: (value: string) => void;
}

export const ExamForm = ({
  examYear,
  examName,
  questions,
  onExamYearChange,
  onExamNameChange,
  onQuestionsChange
}: ExamFormProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="examYear">Ano da Prova</Label>
        <Select value={examYear} onValueChange={onExamYearChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="examName">Nome da Prova</Label>
        <Input
          id="examName"
          value={examName}
          onChange={(e) => onExamNameChange(e.target.value)}
          placeholder="Ex: EsIE 2024"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="questions">Questões (formato JSON)</Label>
        <Textarea
          id="questions"
          value={questions}
          onChange={(e) => onQuestionsChange(e.target.value)}
          placeholder='Cole aqui as questões no formato JSON, uma por linha...'
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    </div>
  );
};