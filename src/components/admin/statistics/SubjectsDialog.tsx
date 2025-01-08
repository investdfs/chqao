import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSubjectsStats } from "@/components/student/dashboard/hooks/useSubjectsStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "lucide-react";

export const SubjectsDialog = () => {
  const { data: subjectGroups, isLoading } = useSubjectsStats();

  // Calculate total questions
  const totalQuestions = subjectGroups?.reduce(
    (total, group) => total + group.totalQuestions,
    0
  ) || 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          Questões por Matéria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>MATÉRIAS DISPONÍVEIS</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: {totalQuestions} questões
            </span>
          </DialogTitle>
        </DialogHeader>

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
                  <span className="font-bold">{group.name}</span>
                  <span className="text-muted-foreground">
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
                      <span className="font-semibold truncate">
                        {subject.subject}
                      </span>
                      <span className="text-xs ml-2">
                        ({subject.questionCount} questões)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};