import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { useSubjectsStats } from "./hooks/useSubjectsStats";
import { Skeleton } from "@/components/ui/skeleton";

export const SubjectsPanel = () => {
  const { data: subjectsStats, isLoading } = useSubjectsStats();

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">MATÉRIAS DISPONÍVEIS</CardTitle>
        <Book className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-[2fr,1fr] gap-4 text-sm font-medium text-muted-foreground">
              <div>Matéria</div>
              <div className="text-right">Questões</div>
            </div>
            {subjectsStats?.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr,1fr] gap-4 text-sm items-center"
              >
                <div>{subject.subject}</div>
                <div className="text-right font-medium">{subject.questionCount}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};