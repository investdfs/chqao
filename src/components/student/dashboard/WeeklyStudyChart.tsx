import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeeklyStudyChartProps {
  data: {
    study_day: string;
    question_count: number;
    study_time: string;
  }[];
}

export const WeeklyStudyChart = ({ data }: WeeklyStudyChartProps) => {
  console.log("Rendering WeeklyStudyChart with data:", data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questões por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="study_day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="question_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};