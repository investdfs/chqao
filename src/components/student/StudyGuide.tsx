import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trophy } from "lucide-react";

interface StudyGuideProps {
  weakPoints: string[];
  strongPoints: string[];
}

export const StudyGuide = ({ weakPoints, strongPoints }: StudyGuideProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-error">
            <AlertTriangle className="h-4 w-4" />
            Pontos Fracos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Atenção! Foque em resolver questões destes tópicos para melhorar sua taxa de acertos.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {weakPoints.map((point) => (
              <li key={point} className="text-sm">{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-success">
            <Trophy className="h-4 w-4" />
            Pontos Fortes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Continue praticando para manter seu bom desempenho!
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {strongPoints.map((point) => (
              <li key={point} className="text-sm">{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};