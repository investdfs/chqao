import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: answerCounts, isLoading } = useQuery({
    queryKey: ["question-stats", questionId],
    queryFn: async () => {
      console.log("Buscando contagem de respostas para questão:", questionId);
      const { data, error } = await supabase
        .rpc("get_answer_counts", { question_id: questionId });

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      console.log("Contagem de respostas:", data);
      return data;
    },
  });

  const totalAnswers = answerCounts?.reduce((sum, item) => sum + Number(item.count), 0) || 0;
  const chartData = answerCounts?.map(item => ({
    option: item.option_letter,
    count: item.count,
    isCorrect: item.option_letter === correctAnswer,
  })) || [];

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
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill={(entry) => entry.isCorrect ? "#22c55e" : "#3b82f6"}
                        name="Respostas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Detalhes</h3>
                {chartData.map((item) => (
                  <div key={item.option} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        Alternativa {item.option}
                        {item.isCorrect && (
                          <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                            Correta
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground">
                        {((item.count / totalAnswers) * 100).toFixed(1)}% ({item.count} respostas)
                      </span>
                    </div>
                    <Progress
                      value={(item.count / totalAnswers) * 100}
                      className={item.isCorrect ? "bg-success/20" : ""}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Total de respostas: {totalAnswers}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};