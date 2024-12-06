import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface QuestionStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  correctAnswer: string;
}

export function QuestionStatsDialog({
  open,
  onOpenChange,
  questionId,
  correctAnswer,
}: QuestionStatsDialogProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['question-stats', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_answer_counts', { question_id: questionId });

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const totalAnswers = stats?.reduce((acc, curr) => acc + Number(curr.count), 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estatísticas da Questão</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <p>Carregando estatísticas...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de respostas: {totalAnswers}
              </p>
              <div className="space-y-2">
                {stats?.map((stat) => {
                  const percentage = totalAnswers > 0
                    ? ((Number(stat.count) / totalAnswers) * 100).toFixed(1)
                    : '0';

                  return (
                    <div key={stat.option_letter} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={`font-medium ${
                          stat.option_letter === correctAnswer
                            ? 'text-success dark:text-green-400'
                            : ''
                        }`}>
                          Alternativa {stat.option_letter}
                        </span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            stat.option_letter === correctAnswer
                              ? 'bg-success dark:bg-green-500'
                              : 'bg-primary dark:bg-blue-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}