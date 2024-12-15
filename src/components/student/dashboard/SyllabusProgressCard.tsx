import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SyllabusProgressCardProps {
  completedTopics: number;
  pendingTopics: number;
  percentage: number;
}

export const SyllabusProgressCard = ({ 
  completedTopics = 0, 
  pendingTopics = 0, 
  percentage = 0 
}: SyllabusProgressCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">PROGRESSO NO EDITAL</CardTitle>
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-success">{completedTopics} Tópicos Concluídos</span>
          <span className="text-warning">{pendingTopics} Tópicos Pendentes</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="text-2xl font-bold text-center">{percentage}%</div>
      </CardContent>
    </Card>
  );
};