import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuestionStats } from "@/hooks/useQuestionStats";
import { StatsChart } from "./stats/StatsChart";
import { StatsDetails } from "./stats/StatsDetails";

interface QuestionStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  correctAnswer: string;
}

export const QuestionStatsDialog = ({
  open,
  onOpenChange,
  questionId,
  correctAnswer,
}: QuestionStatsDialogProps) => {
  const { chartData, totalAnswers, isLoading } = useQuestionStats(questionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">
            Estatísticas da Questão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="text-center">Carregando estatísticas...</div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Distribuição de Respostas</h3>
                <StatsChart data={chartData} correctAnswer={correctAnswer} />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Detalhes</h3>
                <StatsDetails 
                  data={chartData}
                  correctAnswer={correctAnswer}
                  totalAnswers={totalAnswers}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};