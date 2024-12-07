import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyStudyData {
  day: string;
  questions: number;
  time: number;
}

interface WeeklyStudyChartProps {
  data: WeeklyStudyData[];
}

export const WeeklyStudyChart = ({ data }: WeeklyStudyChartProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-sm font-medium">ESTUDO SEMANAL</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="questions" fill="#10B981" name="Questões" />
              <Bar dataKey="time" fill="#6366F1" name="Tempo (h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};