import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface StudyConsistencyChartProps {
  studyDays: Array<{
    date: string;
    studied: boolean;
  }>;
}

export const StudyConsistencyChart = ({ studyDays }: StudyConsistencyChartProps) => {
  // Process data for the chart - all days start as not studied
  const chartData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    
    return {
      day: day.toString(),
      diasEstudados: 0,
      diasNaoEstudados: day, // Incrementa conforme os dias passam
      porcentagemEstudada: "0.0"
    };
  });

  // Calculate overall performance metrics - inicialmente zero
  const totalDays = studyDays.length;
  const studiedDays = 0;
  const studyPercentage = 0;

  const getFeedbackMessage = () => {
    if (studyPercentage >= 70) {
      return {
        icon: <CheckCircle2 className="h-6 w-6 text-success" />,
        title: "Excelente Progresso!",
        message: `Parabéns pelo seu comprometimento! Você estudou em ${studiedDays} dos ${totalDays} dias registrados (${studyPercentage.toFixed(1)}%). Continue mantendo essa consistência e lembre-se de revisar as questões que errou para fortalecer seu aprendizado.`
      };
    }

    return {
      icon: <AlertTriangle className="h-6 w-6 text-warning" />,
      title: "Atenção!",
      message: totalDays === 0 
        ? "Você ainda não começou seus estudos este mês. Que tal começar agora? Estabeleça uma rotina diária de estudos e pratique com questões regularmente. Lembre-se de que a consistência é a chave para o sucesso nos estudos. Comece hoje mesmo a resolver questões e acompanhe seu progresso diário."
        : `Você estudou em apenas ${studiedDays} dos ${totalDays} dias registrados (${studyPercentage.toFixed(1)}%). Para melhorar seu desempenho, tente estabelecer uma rotina diária de estudos, mesmo que por um curto período. Não se esqueça de revisar as questões que errou, pois elas são oportunidades valiosas de aprendizado.`
    };
  };

  const feedback = getFeedbackMessage();

  return (
    <Card className="p-4 space-y-6">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              interval={2}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: 'Dias Acumulados', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              label={{ value: 'Porcentagem (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="diasEstudados"
              stroke="#10B981"
              name="Dias Estudados"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="diasNaoEstudados"
              stroke="#EF4444"
              name="Dias Não Estudados"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="porcentagemEstudada"
              stroke="#8B5CF6"
              name="Porcentagem Estudada (%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-primary-light/30 p-6 rounded-xl shadow-sm space-y-3">
        <div className="flex items-center gap-3 bg-white/80 p-3 rounded-lg">
          {feedback.icon}
          <h3 className="font-semibold text-lg text-primary-dark">{feedback.title}</h3>
        </div>
        <div className="bg-white/80 p-4 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {feedback.message}
          </p>
        </div>
      </div>
    </Card>
  );
};