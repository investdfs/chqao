
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UnstudiedSubjectsProps {
  subjects: string[];
}

export const UnstudiedSubjects = ({ subjects }: UnstudiedSubjectsProps) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 text-amber-800 mb-2">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-medium">Matérias ainda não estudadas</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <Badge
            key={subject}
            variant="secondary"
            className="bg-amber-100 text-amber-800"
          >
            {subject}
          </Badge>
        ))}
      </div>
    </div>
  );
};
