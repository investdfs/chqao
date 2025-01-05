import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface QuestionStatsProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

const QuestionStats = memo(({ totalQuestions, correctAnswers, incorrectAnswers }: QuestionStatsProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    navigate("/student-dashboard");
  };

  const pieData = [
    { name: 'Acertos', value: correctAnswers, color: '#22c55e' },
    { name: 'Erros', value: incorrectAnswers, color: '#ef4444' },
  ];

  return (
    <>
      <div className="flex justify-between items-center gap-4 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="font-semibold">Questões: </span>
            <span className="font-bold">{totalQuestions}</span>
          </div>
          
          <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="font-semibold">Acertos: </span>
            <span className="font-bold text-success">{correctAnswers}</span>
          </div>
          
          <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="font-semibold">Erros: </span>
            <span className="font-bold text-error">{incorrectAnswers}</span>
          </div>
          
          <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="font-semibold">Aproveitamento: </span>
            <span className={`font-bold ${percentage >= 50 ? 'text-success' : 'text-error'}`}>
              {percentage}%
            </span>
          </div>
        </div>

        <Button 
          variant="destructive" 
          onClick={handleExit}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold gradient-text">
              Resumo da Sessão de Estudos
            </DialogTitle>
            <DialogDescription>
              Confira seu desempenho nesta sessão antes de sair
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Estatísticas</h3>
                <ul className="space-y-2">
                  <li>Total de questões: {totalQuestions}</li>
                  <li className="text-success">Acertos: {correctAnswers}</li>
                  <li className="text-error">Erros: {incorrectAnswers}</li>
                  <li>Aproveitamento: {percentage}%</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Gráfico de Desempenho</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowExitDialog(false)}>
                Continuar Estudando
              </Button>
              <Button variant="destructive" onClick={confirmExit}>
                Confirmar Saída
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

QuestionStats.displayName = 'QuestionStats';

export default QuestionStats;