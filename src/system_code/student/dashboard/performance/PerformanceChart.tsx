import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  recommendations: Array<{
    subject: string;
    questions_answered: number;
    correct_answers: number;
  }>;
}

export const PerformanceChart = ({ recommendations }: PerformanceChartProps) => {
  const data = recommendations.map(rec => ({
    subject: rec.subject,
    acertos: (rec.correct_answers / rec.questions_answered * 100).toFixed(1),
    total: rec.questions_answered
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="acertos" fill="#4f46e5" name="Taxa de Acertos (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};