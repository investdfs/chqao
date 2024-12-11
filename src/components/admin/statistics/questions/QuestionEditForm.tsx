import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionEditFormProps {
  selectedQuestion: any;
  onQuestionChange: (field: string, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export const QuestionEditForm = ({
  selectedQuestion,
  onQuestionChange,
  onSave,
  onDelete,
  onCancel
}: QuestionEditFormProps) => {
  if (!selectedQuestion) return null;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <Label>Texto da Questão</Label>
        <Input
          value={selectedQuestion.text}
          onChange={(e) => onQuestionChange("text", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Matéria</Label>
          <Input
            value={selectedQuestion.subject}
            onChange={(e) => onQuestionChange("subject", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Tópico</Label>
          <Input
            value={selectedQuestion.topic || ""}
            onChange={(e) => onQuestionChange("topic", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Opções</Label>
        {["a", "b", "c", "d", "e"].map((option) => (
          <Input
            key={option}
            value={selectedQuestion[`option_${option}`]}
            onChange={(e) => onQuestionChange(`option_${option}`, e.target.value)}
            placeholder={`Opção ${option.toUpperCase()}`}
            className="mb-2"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Resposta Correta</Label>
          <Select 
            value={selectedQuestion.correct_answer} 
            onValueChange={(value) => onQuestionChange("correct_answer", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a resposta correta" />
            </SelectTrigger>
            <SelectContent>
              {["A", "B", "C", "D", "E"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Explicação</Label>
          <Input
            value={selectedQuestion.explanation || ""}
            onChange={(e) => onQuestionChange("explanation", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
        >
          Excluir
        </Button>
        <Button
          onClick={onSave}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};