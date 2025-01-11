import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceData } from "./performance/usePerformanceData";
import { PerformanceChart } from "./performance/PerformanceChart";

export const PerformanceEvolutionCard = ({ userId }: { userId?: string }) => {
  const { data: monthlyPerformance = [], isLoading } = usePerformanceData(userId);

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
        <CardTitle className="text-lg font-semibold">Evolução do Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <PerformanceChart monthlyPerformance={monthlyPerformance} />
        <p className="text-sm text-muted-foreground text-center mt-4">
          Média de aproveitamento mensal nos últimos 6 meses
        </p>
      </CardContent>
    </Card>
  );
};