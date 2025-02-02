import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  totalCorrect: number;
  totalIncorrect: number;
}

export const PerformanceChart = ({ totalCorrect, totalIncorrect }: PerformanceChartProps) => {
  const data = [
    { name: "Corretas", value: totalCorrect },
    { name: "Incorretas", value: totalIncorrect }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};