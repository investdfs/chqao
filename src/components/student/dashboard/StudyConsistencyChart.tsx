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

interface StudyConsistencyChartProps {
  studyDays: Array<{
    date: string;
    studied: boolean;
  }>;
}

export const StudyConsistencyChart = ({ studyDays }: StudyConsistencyChartProps) => {
  // Process data for the chart
  const chartData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const studied = studyDays.some(
      d => new Date(d.date).getDate() === day && d.studied
    );
    
    // Calculate cumulative counts up to this day
    const cumulativeStudied = studyDays.filter(
      d => new Date(d.date).getDate() <= day && d.studied
    ).length;
    
    const cumulativeNotStudied = studyDays.filter(
      d => new Date(d.date).getDate() <= day && !d.studied
    ).length;

    return {
      day: day.toString(),
      diasEstudados: cumulativeStudied,
      diasNaoEstudados: cumulativeNotStudied,
      porcentagemEstudada: ((cumulativeStudied / (cumulativeStudied + cumulativeNotStudied)) * 100 || 0).toFixed(1)
    };
  });

  // Calculate overall performance metrics
  const totalDays = studyDays.length;
  const studiedDays = studyDays.filter(day => day.studied).length;
  const studyPercentage = (studiedDays / totalDays) * 100;
  const isGoodPerformance = studyPercentage >= 70;

  const getFeedbackMessage = () => {
    if (totalDays === 0) {
      return "Você ainda não começou seus estudos este mês. Que tal começar agora? Estabeleça uma rotina diária de estudos e pratique com questões regularmente.";
    }

    if (isGoodPerformance) {
      return `Parabéns pelo seu comprometimento! Você estudou em ${studiedDays} dos ${totalDays} dias registrados (${studyPercentage.toFixed(1)}%). Continue mantendo essa consistência e lembre-se de revisar as questões que errou para fortalecer seu aprendizado.`;
    }

    return `Atenção! Você estudou em apenas ${studiedDays} dos ${totalDays} dias registrados (${studyPercentage.toFixed(1)}%). Para melhorar seu desempenho, tente estabelecer uma rotina diária de estudos, mesmo que por um curto período. Não se esqueça de revisar as questões que errou, pois elas são oportunidades valiosas de aprendizado.`;
  };

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
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        {getFeedbackMessage()}
      </div>
    </Card>
  );
};