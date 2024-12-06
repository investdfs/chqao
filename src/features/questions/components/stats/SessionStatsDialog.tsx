import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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
          <DialogTitle className="text-xl font-bold">
            Percentual de Rendimento
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex justify-center items-center">
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Alternativas mais respondidas</h3>
            <BarChart width={300} height={200} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="option" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Total de questões respondidas: {totalAnswers}
        </div>
      </DialogContent>
    </Dialog>
  );
};