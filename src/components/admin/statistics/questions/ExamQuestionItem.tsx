import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Pencil, Trash2, EyeOff } from "lucide-react";

interface ExamQuestionItemProps {
  question: any;
  onDelete: (id: string) => void;
  onHide: (id: string) => void;
  onShow: (id: string) => void;
  onEdit: (question: any) => void;
  onPreview: (question: any) => void;
}

export const ExamQuestionItem = ({
  question,
  onDelete,
  onHide,
  onShow,
  onEdit,
  onPreview
}: ExamQuestionItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col mb-2">
            <span className="text-sm font-medium text-primary">
              {question.subject}
            </span>
            <span className="text-sm text-muted-foreground">
              Concurso: EIPS/CHQAO {question.exam_year}
            </span>
          </div>
          <p className="text-sm">{question.text}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview(question)}
            title="Visualizar questão"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(question)}
            title="Editar questão"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question.id)}
            title="Excluir questão"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => question.status === 'active' ? onHide(question.id) : onShow(question.id)}
            title={question.status === 'active' ? "Ocultar questão" : "Mostrar questão"}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};