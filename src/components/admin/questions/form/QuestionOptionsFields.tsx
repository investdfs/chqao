import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionOptionsFieldsProps {
  options: {
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
  };
  correctAnswer: string;
  onInputChange: (field: string, value: string) => void;
}

export const QuestionOptionsFields = ({ options, correctAnswer, onInputChange }: QuestionOptionsFieldsProps) => {
  return (
    <div className="space-y-4">
      <Label>Alternativas *</Label>
      {['a', 'b', 'c', 'd', 'e'].map((option) => (
        <div key={option} className="flex gap-2 items-center">
          <span className="w-6 text-center font-medium">{option.toUpperCase()}</span>
          <Input
            value={options[`option_${option}` as keyof typeof options]}
            onChange={(e) => onInputChange(`option_${option}`, e.target.value)}
            placeholder={`Digite a alternativa ${option.toUpperCase()}`}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="correct_answer">Resposta Correta *</Label>
        <Select
          value={correctAnswer}
          onValueChange={(value) => onInputChange("correct_answer", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a alternativa correta" />
          </SelectTrigger>
          <SelectContent>
            {['A', 'B', 'C', 'D', 'E'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};