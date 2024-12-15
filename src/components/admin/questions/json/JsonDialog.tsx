import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SubjectTopicSelect } from "../form/SubjectTopicSelect";
import { JsonInputField } from "../json-image/JsonInputField";

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
        <DialogDescription>
          Cole o JSON das questões abaixo e selecione a matéria e o tópico correspondentes.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <SubjectTopicSelect
          subject={subject}
          topic={topic}
          onSubjectChange={onSubjectChange}
          onTopicChange={onTopicChange}
        />

        <JsonInputField
          value={jsonInput}
          onChange={onJsonChange}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Inserir Questões"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};