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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudyConsistencyChart } from "./StudyConsistencyChart";
import { useState } from "react";

interface StudyConsistencyProps {
  consecutiveDays: number;
  loginDays: Array<{
    date: string;
    has_login: boolean;
  }>;
}

export const StudyConsistency = ({ consecutiveDays, loginDays }: StudyConsistencyProps) => {
  const [selectedRange, setSelectedRange] = useState<string>("all");
  
  // Generate array of all days with login status
  const allDays = loginDays.map(day => ({
    date: day.date,
    studied: day.has_login
  }));

  // Filter days based on selected range
  const visibleDays = selectedRange === "all" 
    ? allDays 
    : allDays.slice((parseInt(selectedRange) - 1) * 7, parseInt(selectedRange) * 7);

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
              <StudyConsistencyChart studyDays={allDays} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Você está há {consecutiveDays} dias sem falhar!
        </p>
        <div className="md:hidden mb-4">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os dias</SelectItem>
              <SelectItem value="1">Semana 1 (1-7)</SelectItem>
              <SelectItem value="2">Semana 2 (8-14)</SelectItem>
              <SelectItem value="3">Semana 3 (15-21)</SelectItem>
              <SelectItem value="4">Semana 4 (22-28)</SelectItem>
              <SelectItem value="5">Semana 5 (29-31)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:flex justify-between overflow-x-auto gap-2 pb-2 px-1">
          {allDays.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center min-w-[32px]"
            >
              <span className="text-xs text-gray-500 mb-1">
                {new Date(day.date).getDate()}
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
        <div className="flex md:hidden justify-between overflow-x-auto gap-2 pb-2 px-1">
          {visibleDays.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center min-w-[32px]"
            >
              <span className="text-xs text-gray-500 mb-1">
                {new Date(day.date).getDate()}
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