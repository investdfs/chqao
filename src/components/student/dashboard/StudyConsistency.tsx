import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, X, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudyConsistencyChart } from "./StudyConsistencyChart";

interface StudyConsistencyProps {
  consecutiveDays: number;
  studyDays: Array<{
    date: string;
    studied: boolean;
  }>;
}

export const StudyConsistency = ({ consecutiveDays, studyDays }: StudyConsistencyProps) => {
  // Generate array of all days 1-31
  const allDays = Array.from({ length: 31 }, (_, i) => {
    const currentDate = new Date();
    currentDate.setDate(i + 1);
    return {
      date: currentDate.toISOString(),
      studied: studyDays.some(day => 
        new Date(day.date).getDate() === (i + 1) && day.studied
      )
    };
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          CONSTÂNCIA NOS ESTUDOS - PROGRESSO MENSAL
        </CardTitle>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <BarChart className="h-4 w-4" />
                Gráfico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Análise de Estudos do Mês</DialogTitle>
              </DialogHeader>
              <StudyConsistencyChart studyDays={studyDays} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Você está há {consecutiveDays} dias sem falhar!
        </p>
        <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-16 gap-1 w-full auto-rows-max overflow-x-auto pb-2">
          {allDays.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center"
            >
              <span className="text-xs text-gray-500 mb-1">
                {index + 1}
              </span>
              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center relative transition-colors ${
                  day.studied ? 'bg-success/20' : 'bg-error/20'
                }`}
              >
                {day.studied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-error" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};