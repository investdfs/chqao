import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface StatsChartProps {
  data: Array<{
    option: string;
    count: number;
  }>;
  correctAnswer: string;
}

export const StatsChart = ({ data, correctAnswer }: StatsChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="option" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" name="Respostas">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.option === correctAnswer ? "#22c55e" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};