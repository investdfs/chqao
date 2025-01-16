import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceData } from "./performance/usePerformanceData";
import { PerformanceChart } from "./performance/PerformanceChart";
import { AlertCircle } from "lucide-react";

export const PerformanceEvolutionCard = ({ userId }: { userId?: string }) => {
  const { data: recommendations = [], isLoading } = usePerformanceData(userId);

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Recomendação de Estudos
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <PerformanceChart recommendations={recommendations} />
        </div>
        {recommendations.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-sm text-muted-foreground text-center">
              O gráfico mostra suas horas de estudo atuais vs. recomendadas por matéria
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Atenção Necessária</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Em Progresso</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Bom Ritmo</span>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              Linha amarela: meta mínima de 4 horas por matéria
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};