import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSessionTime } from "@/hooks/useSessionTime";

interface StudyTimeCardProps {
  totalTime: string;
}

export const StudyTimeCard = ({ totalTime = "0h 0min" }: StudyTimeCardProps) => {
  const { sessionTimeFormatted } = useSessionTime();

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">TEMPO DE ESTUDO</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{totalTime}</div>
          <div className="text-xs text-muted-foreground">
            Você está logado há {sessionTimeFormatted}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};