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
          <SelectContent className="bg-white">
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
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="questions">Questões (formato JSON)</Label>
        <Textarea
          id="questions"
          value={questions}
          onChange={(e) => onQuestionsChange(e.target.value)}
          placeholder={`Cole aqui as questões no formato JSON, uma por linha...

Exemplo:
{
    "questao": "Qual foi a principal razão para a transferência da Corte Portuguesa para o Brasil em 1808?",
    "opcao_a": "A busca por novas colônias.",
    "opcao_b": "A invasão napoleônica a Portugal.",
    "opcao_c": "O interesse em expandir o comércio com a colônia.",
    "opcao_d": "A necessidade de recursos naturais do Brasil.",
    "opcao_e": "A busca por apoio militar.",
    "resposta_correta": "B",
    "comentario": "A transferência da Corte ocorre devido à invasão napoleônica a Portugal, que obrigou a família real a buscar refúgio no Brasil.",
    "nivel": "Fácil",
    "status": "active"
}`}
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    </div>
  );
};