import { useState } from "react";
import { Check, X, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionStatsDialog } from "@/features/questions/components/stats/SessionStatsDialog";
import { useSessionPerformance } from "@/hooks/useSessionPerformance";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface QuestionFeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onReset: () => void;
  questionId: string;
  sessionStats?: {
    correctAnswers: number;
    totalAnswers: number;
    answerDistribution: Record<string, number>;
  };
}

const QuestionFeedback = ({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onReset,
  questionId,
  sessionStats = {
    correctAnswers: 0,
    totalAnswers: 0,
    answerDistribution: {},
  },
}: QuestionFeedbackProps) => {
  const [showStats, setShowStats] = useState(false);
  const { saveSessionPerformance } = useSessionPerformance();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleExit = async () => {
    console.log("Salvando desempenho da sessão:", sessionStats);
    
    try {
      await saveSessionPerformance(
        sessionStats.correctAnswers,
        sessionStats.totalAnswers - sessionStats.correctAnswers
      );

      // Força a atualização dos dados de performance
      await queryClient.invalidateQueries({ queryKey: ['performance-history'] });

      toast({
        title: "Sessão finalizada",
        description: "Seu desempenho foi registrado com sucesso!",
      });

      navigate("/student-dashboard");
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar sessão",
        description: "Não foi possível salvar seu desempenho."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-lg ${
          isCorrect
            ? "bg-success-light border border-success dark:bg-blue-900/30 dark:border-blue-700"
            : "bg-error-light border border-error dark:bg-red-900/30 dark:border-red-700"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isCorrect ? (
            <>
              <Check className="h-5 w-5 text-success dark:text-blue-400" />
              <span className="font-medium text-success dark:text-blue-400">
                Você acertou! 🎉
              </span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-error dark:text-red-400" />
              <span className="font-medium text-error dark:text-red-400">
                Você errou! ⚠️
              </span>
            </>
          )}
        </div>
        <p className="text-sm dark:text-gray-300">
          Resposta correta: {correctAnswer}
        </p>
        <p className="text-sm mt-2 dark:text-gray-300">{explanation}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <Button variant="outline" size="sm" onClick={onReset}>
          Refazer
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowStats(true)}>
            <BarChart className="h-4 w-4 mr-2" />
            Estatísticas
          </Button>
          <Button variant="default" size="sm" onClick={handleExit}>
            Sair
          </Button>
        </div>
      </div>

      <SessionStatsDialog
        open={showStats}
        onOpenChange={setShowStats}
        sessionStats={sessionStats}
      />
    </div>
  );
};

export default QuestionFeedback;