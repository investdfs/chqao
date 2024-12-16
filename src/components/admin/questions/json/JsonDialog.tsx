import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubjectTopicFields } from "../form/SubjectTopicFields";

interface JsonDialogProps {
  subject: string;
  topic: string;
  jsonInput: string;
  isLoading: boolean;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onJsonChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const JsonDialog = ({
  subject,
  topic,
  jsonInput,
  isLoading,
  onSubjectChange,
  onTopicChange,
  onJsonChange,
  onSubmit,
  onCancel
}: JsonDialogProps) => {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Inserir Questões via JSON</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-4">
          <SubjectTopicFields
            subject={subject}
            topic={topic}
            onInputChange={(field, value) => {
              if (field === "subject") onSubjectChange(value);
              if (field === "topic") onTopicChange(value);
            }}
            isOptional={true}
            helperText="Estes campos são opcionais e serão usados apenas se não estiverem definidos no JSON. No JSON, 'theme' é a matéria principal e 'subject' é o assunto específico."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="json">JSON das Questões *</Label>
          <Textarea
            id="json"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder={`Cole aqui o JSON das questões...

Exemplo de estrutura:
{
  "theme": "História do Brasil",
  "subject": "Os Partidos Políticos",
  "text": "Texto da questão...",
  "option_a": "Alternativa A",
  ...
}`}
            className="min-h-[300px] font-mono"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading || !jsonInput.trim()}
        >
          {isLoading ? "Processando..." : "Inserir Questões"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};