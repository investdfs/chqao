import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { useSubjectsStats } from "@/components/student/dashboard/hooks/useSubjectsStats";
import { Skeleton } from "@/components/ui/skeleton";

export const SubjectsPanel = () => {
  const { data: subjectGroups, isLoading } = useSubjectsStats();

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full min-w-[320px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold">MATÉRIAS DISPONÍVEIS</CardTitle>
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
                <div className="flex flex-col text-sm bg-gray-100 p-2 rounded-lg">
                  <span className="font-bold whitespace-nowrap">{group.name}</span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    ({group.totalQuestions} questões)
                  </span>
                </div>
                <div className="space-y-0.5 pl-4">
                  {group.subjects.map((subject, subjectIndex) => (
                    <div
                      key={subjectIndex}
                      className={`flex justify-between items-center p-2 rounded-lg text-sm text-muted-foreground
                        ${subjectIndex % 2 === 0 ? 'bg-gray-100/70' : 'bg-gray-200/70'}`}
                    >
                      <span className="font-semibold min-w-[200px]">{subject.subject}</span>
                      <span className="text-xs ml-2 whitespace-nowrap">
                        ({subject.questionCount} questões)
                      </span>
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