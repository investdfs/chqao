import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

interface StudyRecommendation {
  subject: string;
  currentHours: number;
  recommendedHours: number;
  questionsPerDay: number;
  status: 'danger' | 'warning' | 'success';
}

interface PerformanceChartProps {
  recommendations: StudyRecommendation[];
}

export const PerformanceChart = ({ recommendations }: PerformanceChartProps) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        Comece a praticar questões para receber recomendações personalizadas de estudo
      </div>
    );
  }

  const data = recommendations.map(rec => ({
    ...rec,
    fill: rec.status === 'danger' ? '#ef4444' : rec.status === 'warning' ? '#f59e0b' : '#22c55e'
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="subject"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Horas de Estudo', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'currentHours') return [`${value}h`, 'Horas Atuais'];
              if (name === 'recommendedHours') return [`${value}h`, 'Horas Recomendadas'];
              return [value, name];
            }}
          />
          <Bar 
            dataKey="currentHours" 
            fill="#3b82f6"
            name="Horas Atuais"
          />
          <Bar 
            dataKey="recommendedHours" 
            fill="#94a3b8"
            name="Horas Recomendadas"
            opacity={0.3}
          />
          <ReferenceLine y={4} stroke="#f59e0b" strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};