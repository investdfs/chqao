import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trophy } from "lucide-react";

interface StudyGuideProps {
  weakPoints: string[];
  strongPoints: string[];
}

export const StudyGuide = ({ weakPoints, strongPoints }: StudyGuideProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text">Guia de Estudos</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="font-semibold">Pontos para Melhorar</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Foque em resolver questões destes tópicos para melhorar sua taxa de acertos:
          </p>
          <ul className="space-y-2">
            {weakPoints.map((point) => (
              <li key={point} className="text-sm bg-error-light text-error rounded-lg px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-success">
            <Trophy className="h-4 w-4" />
            <h3 className="font-semibold">Pontos Fortes</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Continue praticando para manter seu bom desempenho!
          </p>
          <ul className="space-y-2">
            {strongPoints.map((point) => (
              <li key={point} className="text-sm bg-success-light text-success rounded-lg px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};