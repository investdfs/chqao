import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SessionStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionStats: {
    correctAnswers: number;
    totalAnswers: number;
    answerDistribution: Record<string, number>;
  };
}

export const SessionStatsDialog = ({
  open,
  onOpenChange,
  sessionStats,
}: SessionStatsDialogProps) => {
  const { correctAnswers, totalAnswers, answerDistribution } = sessionStats;
  const incorrectAnswers = totalAnswers - correctAnswers;
  const correctPercentage = totalAnswers > 0 
    ? Math.round((correctAnswers / totalAnswers) * 100) 
    : 0;

  const pieData = [
    { name: "Acertos", value: correctAnswers, color: "#10B981" },
    { name: "Erros", value: incorrectAnswers, color: "#EF4444" },
  ];

  const barData = Object.entries(answerDistribution).map(([option, count]) => ({
    option,
    count,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">
            Percentual de Rendimento
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col justify-center items-center">
            <div className="text-2xl font-bold mb-2">
              {correctPercentage}% de acertos
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              ({correctAnswers} de {totalAnswers} questões)
            </div>
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Alternativas mais respondidas</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="option" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Total de questões respondidas: {totalAnswers}
        </div>
      </DialogContent>
    </Dialog>
  );
};