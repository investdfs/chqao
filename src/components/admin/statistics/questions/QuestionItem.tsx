import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface QuestionItemProps {
  question: {
    id: string;
    text: string;
    theme: string;
    subject: string;
    topic: string;
    difficulty: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: 'hidden' | 'deleted') => void;
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
  const renderMetadata = () => {
    const parts = [
      question.theme || 'Sem tema',
      question.subject || 'Sem matéria',
      question.topic || 'Questão Inédita',
      question.difficulty || 'Médio'
    ];
    
    return parts.join(' • ');
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(question.id)}
        className="mt-1"
      />
      
      <div className="flex-1 space-y-2">
        <div className="text-sm text-muted-foreground">
          {renderMetadata()}
        </div>
        
        <p className="text-sm">{question.text}</p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(question)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(question)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onStatusChange(question.id, 'deleted')}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};