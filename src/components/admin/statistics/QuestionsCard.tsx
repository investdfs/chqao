import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditQuestionsDialog } from "./EditQuestionsDialog";

interface QuestionsCardProps {
  totalQuestions: number;
}

export const QuestionsCard = ({ totalQuestions }: QuestionsCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <BookOpen className="h-4 w-4" />
            Questões
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
      <CardContent className="p-3 pt-0">
        <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
        <p className="text-xs text-gray-600">Questões cadastradas</p>
      </CardContent>

      <EditQuestionsDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </Card>
  );
};