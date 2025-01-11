import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface PerformanceChartProps {
  monthlyPerformance: Array<{
    month: string;
    averagePercentage: number;
  }>;
}

export const PerformanceChart = ({ monthlyPerformance }: PerformanceChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyPerformance}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Aproveitamento']}
          />
          <Line
            type="monotone"
            dataKey="averagePercentage"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};