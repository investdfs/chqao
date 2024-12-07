import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check } from "lucide-react";

interface StudyConsistencyProps {
  consecutiveDays: number;
  studyDays: Array<{
    date: string;
    studied: boolean;
  }>;
}

export const StudyConsistency = ({ consecutiveDays, studyDays }: StudyConsistencyProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">CONSTÂNCIA NOS ESTUDOS - PROGRESSO MENSAL</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Você está há {consecutiveDays} dias sem falhar!
        </p>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {studyDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">
                {new Date(day.date).getDate()}
              </span>
              <div
                className={`w-6 h-6 rounded-sm flex-shrink-0 flex items-center justify-center relative ${
                  day.studied ? 'bg-success/20' : 'bg-error/20'
                }`}
              >
                {day.studied && (
                  <Check className="w-4 h-4 text-success" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};