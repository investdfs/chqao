import { BarChart as BarChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    return {
      day: day.toString(),
      questionsCompleted: studied ? 1 : 0,
    };
  });

  return (
    <Card className="p-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, 1]}
              ticks={[0, 1]}
            />
            <Tooltip />
            <Bar
              dataKey="questionsCompleted"
              fill="#10B981"
              name="Questões Realizadas"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};