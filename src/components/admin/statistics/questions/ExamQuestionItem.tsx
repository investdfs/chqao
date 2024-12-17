import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface ExamQuestionItemProps {
  question: any;
  onDelete: (id: string) => Promise<void>;
  onHide?: (id: string) => Promise<void>;
  onShow?: (id: string) => Promise<void>;
  onEdit: (question: any) => void;
  onPreview: (question: any) => void;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}

const VALID_SUBJECTS = [
  "Língua Portuguesa",
  "Geografia do Brasil",
  "História do Brasil",
  "Estatuto dos Militares",
  "Licitações e Contratos",
  "Regulamento de Administração do Exército (RAE)",
  "Direito Militar e Sindicância no Âmbito do Exército Brasileiro",
  "Código Penal Militar",
  "Código de Processo Penal Militar"
];

export const ExamQuestionItem = ({
  question,
  onDelete,
  onHide,
  onShow,
  onEdit,
  onPreview,
  onSelect,
  isSelected
}: ExamQuestionItemProps) => {
  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Questão excluída com sucesso.");
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error("Erro ao excluir questão.");
    }
  };

  const handleVisibilityToggle = async (id: string, status: string) => {
    try {
      if (status === 'active' && onHide) {
        await onHide(id);
        toast.success("Questão ocultada com sucesso.");
      } else if (onShow) {
        await onShow(id);
        toast.success("Questão ativada com sucesso.");
      }
    } catch (error) {
      console.error('Error toggling question visibility:', error);
      toast.error("Erro ao alterar visibilidade da questão.");
    }
  };

  // Use theme for subject display, validate against VALID_SUBJECTS
  const subject = VALID_SUBJECTS.find(s => s === question.theme) || "História do Brasil";

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex justify-between items-start gap-4 mb-2">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 space-y-1">
              <div className="text-primary/70">{subject}</div>
              <div>Concurso: EIPS/CHQAO {question.exam_year}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {question.text}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(question)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            title="Editar questão"
          >
            <Edit className="h-4 w-4 text-primary" />
          </button>
          <button
            onClick={() => onPreview(question)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            title="Visualizar questão"
          >
            <Eye className="h-4 w-4 text-primary" />
          </button>
          <button
            onClick={() => handleVisibilityToggle(question.id, question.status)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            title={question.status === 'active' ? "Ocultar questão" : "Mostrar questão"}
          >
            {question.status === 'active' ? (
              <EyeOff className="h-4 w-4 text-primary" />
            ) : (
              <Eye className="h-4 w-4 text-primary" />
            )}
          </button>
          <button
            onClick={() => handleDelete(question.id)}
            className="p-2 hover:bg-error/10 rounded-full transition-colors"
            title="Excluir questão"
          >
            <Trash2 className="h-4 w-4 text-error" />
          </button>
        </div>
      </div>
      <div className="text-sm text-primary">
        Gabarito: {question.correct_answer}
      </div>
    </div>
  );
};