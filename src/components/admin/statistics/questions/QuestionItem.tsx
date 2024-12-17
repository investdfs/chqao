import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash, EyeOff, Eye } from "lucide-react";

interface QuestionItemProps {
  question: any;
  isSelected: boolean;
  onSelect: (questionId: string) => void;
  onStatusChange: (questionId: string, status: 'hidden' | 'deleted') => void;
  onEdit: (question: any) => void;
  onPreview: (question: any) => void;
}

export const QuestionItem = ({
  question,
  isSelected,
  onSelect,
  onStatusChange,
  onEdit,
  onPreview
}: QuestionItemProps) => {
  return (
    <div 
      className={`p-4 border rounded-lg transition-colors ${
        question.status === 'hidden' ? 'bg-red-50 border-red-200' : 
        question.status === 'deleted' ? 'bg-gray-100 border-gray-200' : 
        'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(question.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <p className="font-medium">{question.text}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span>{question.subject}</span>
            {question.theme && <span> • {question.theme}</span>}
            {question.topic && <span> • {question.topic}</span>}
            {question.difficulty && <span> • {question.difficulty}</span>}
          </div>
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
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStatusChange(question.id, 'deleted')}
            title="Excluir questão"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStatusChange(question.id, 'hidden')}
            title="Ocultar questão"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};