import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { useSubjectsStats } from "./hooks/useSubjectsStats";
import { Skeleton } from "@/components/ui/skeleton";

export const SubjectsPanel = () => {
  const { data: subjectGroups, isLoading } = useSubjectsStats();

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
          <div className="space-y-6">
            {subjectGroups?.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold border-b pb-1">
                  <span>{group.name}</span>
                  <span>{group.totalQuestions}</span>
                </div>
                <div className="space-y-2 pl-4">
                  {group.subjects.map((subject, subjectIndex) => (
                    <div
                      key={subjectIndex}
                      className="flex items-center justify-between text-sm text-muted-foreground"
                    >
                      <span>{subject.subject}</span>
                      <span className="font-medium">{subject.questionCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};