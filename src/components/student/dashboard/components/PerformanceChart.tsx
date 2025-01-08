import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  totalCorrect: number;
  totalIncorrect: number;
}

export const PerformanceChart = ({ totalCorrect, totalIncorrect }: PerformanceChartProps) => {
  const data = [
    { name: "Acertos", value: totalCorrect, color: "#10B981" },
    { name: "Erros", value: totalIncorrect, color: "#EF4444" }
  ];

  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};