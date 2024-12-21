import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditQuestionsDialog } from "./EditQuestionsDialog";

interface QuestionsCardProps {
  totalQuestions: number;
  stats: {
    previousExams: {
      questions: number;
    };
  };
}

export const QuestionsCard = ({ totalQuestions, stats }: QuestionsCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Calculate the breakdown based on is_from_previous_exam flag
  const regularQuestions = totalQuestions - (stats?.previousExams?.questions || 0);
  const examQuestions = stats?.previousExams?.questions || 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <BookOpen className="h-4 w-4" />
            Questões Ativas
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
            Editar Questões
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div>
          <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
          <p className="text-xs text-gray-600">Total de questões ativas</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t">
          <div>
            <div className="text-lg font-semibold text-primary">{regularQuestions}</div>
            <p className="text-xs text-gray-600">Questões inéditas</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">{examQuestions}</div>
            <p className="text-xs text-gray-600">Questões de concursos</p>
          </div>
        </div>
      </CardContent>

      <EditQuestionsDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </Card>
  );
};