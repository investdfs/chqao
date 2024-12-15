import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SubjectTopicSelect } from "../form/SubjectTopicSelect";
import { ImageUploadField } from "../form/ImageUploadField";
import { JsonInputField } from "./JsonInputField";

interface JsonImageDialogProps {
  subject: string;
  topic: string;
  jsonInput: string;
  imageUrl: string;
  isLoading: boolean;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onJsonChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const JsonImageDialog = ({
  subject,
  topic,
  jsonInput,
  imageUrl,
  isLoading,
  onSubjectChange,
  onTopicChange,
  onJsonChange,
  onImageChange,
  onSubmit,
  onCancel
}: JsonImageDialogProps) => {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Inserir Questões com Imagem via JSON</DialogTitle>
        <DialogDescription>
          Cole o JSON das questões abaixo, selecione a matéria e o tópico correspondentes, e faça upload da imagem.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <SubjectTopicSelect
          subject={subject}
          topic={topic}
          onSubjectChange={onSubjectChange}
          onTopicChange={onTopicChange}
        />

        <ImageUploadField
          imageUrl={imageUrl}
          onImageChange={onImageChange}
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