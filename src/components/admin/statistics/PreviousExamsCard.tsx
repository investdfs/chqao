import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResetExamDialog } from "./ResetExamDialog";
import { ExamsQuestionsSheet } from "./ExamsQuestionsSheet";

interface PreviousExamsCardProps {
  totalExams: number;
  totalQuestions: number;
  onReset: () => void;
}

export const PreviousExamsCard = ({ 
  totalExams, 
  totalQuestions,
  onReset 
}: PreviousExamsCardProps) => {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showQuestionsSheet, setShowQuestionsSheet] = useState(false);

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <FileText className="h-4 w-4" />
            Provas Anteriores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-primary">{totalExams}</div>
          <p className="text-xs text-gray-600">{totalQuestions} questões</p>
          <div className="mt-2 space-y-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs py-1"
              onClick={() => setShowQuestionsSheet(true)}
            >
              Ver Questões
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full text-xs py-1"
              onClick={() => setShowResetDialog(true)}
            >
              Resetar Banco
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResetExamDialog 
        open={showResetDialog} 
        onOpenChange={setShowResetDialog}
        onReset={onReset}
      />

      <ExamsQuestionsSheet
        open={showQuestionsSheet}
        onOpenChange={setShowQuestionsSheet}
      />
    </>
  );
};