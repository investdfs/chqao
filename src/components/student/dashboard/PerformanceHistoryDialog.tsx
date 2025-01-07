import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PerformanceHistoryDialogProps {
  history: Array<{
    created_at: string;
    correct_answers: number;
    incorrect_answers: number;
    percentage: number;
  }>;
}

export const PerformanceHistoryDialog = ({ history }: PerformanceHistoryDialogProps) => {
  const totalCorrect = history.reduce((sum, session) => sum + session.correct_answers, 0);
  const totalIncorrect = history.reduce((sum, session) => sum + session.incorrect_answers, 0);
  const totalPercentage = history.length > 0 
    ? ((totalCorrect / (totalCorrect + totalIncorrect)) * 100).toFixed(1)
    : "0";

  const chartData = [
    { name: "Acertos", value: totalCorrect, color: "#22c55e" },
    { name: "Erros", value: totalIncorrect, color: "#ef4444" },
  ];

  return (
    <Dialog>
      <DialogTrigger className="text-sm text-blue-500 hover:underline">
        Histórico de Desempenho
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de Desempenho</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Acertos</TableHead>
                  <TableHead>Erros</TableHead>
                  <TableHead>Aproveitamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((session) => (
                  <TableRow key={session.created_at}>
                    <TableCell>
                      {format(new Date(session.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-success">
                      {session.correct_answers}
                    </TableCell>
                    <TableCell className="text-error">
                      {session.incorrect_answers}
                    </TableCell>
                    <TableCell>{session.percentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Desempenho Geral</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-lg">Aproveitamento Total: {totalPercentage}%</p>
              <p>Total de Questões: {totalCorrect + totalIncorrect}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};