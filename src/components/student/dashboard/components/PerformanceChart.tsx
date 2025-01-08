import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface PerformanceChartProps {
  totalCorrect: number;
  totalIncorrect: number;
}

export const PerformanceChart = ({ totalCorrect, totalIncorrect }: PerformanceChartProps) => {
  const pieData = [
    { name: "Acertos", value: totalCorrect, color: "#10B981" },
    { name: "Erros", value: totalIncorrect, color: "#EF4444" }
  ];

  return (
    <div className="flex justify-center items-center">
      <div style={{ width: 100, height: 100 }}>
        <PieChart width={100} height={100}>
          <Pie
            data={pieData}
            cx={50}
            cy={50}
            innerRadius={25}
            outerRadius={40}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};