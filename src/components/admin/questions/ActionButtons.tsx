import { Button } from "@/components/ui/button";
import { Download, Eye, History, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  questionsCount: number;
  onShowQuestions: () => void;
  onShowResetDialog: () => void;
}

export const ActionButtons = ({ questionsCount, onShowQuestions, onShowResetDialog }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
        onClick={() => window.location.href = '/download-template'}
      >
        <Download className="h-4 w-4" />
        Baixar Questões por Matéria
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
      >
        <History className="h-4 w-4" />
        Histórico de Atualizações
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
        onClick={onShowQuestions}
      >
        <Eye className="h-4 w-4" />
        Ver Questões ({questionsCount})
      </Button>

      <Button 
        variant="destructive" 
        className="flex items-center gap-2"
        onClick={onShowResetDialog}
      >
        <Trash2 className="h-4 w-4" />
        Resetar Banco
      </Button>
    </div>
  );
};