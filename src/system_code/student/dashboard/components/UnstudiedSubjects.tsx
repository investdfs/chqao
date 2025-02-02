import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UnstudiedSubjectsProps {
  subjects: string[];
}

export const UnstudiedSubjects = ({ subjects }: UnstudiedSubjectsProps) => {
  if (!subjects.length) return null;

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Matérias não estudadas</AlertTitle>
      <AlertDescription>
        Você ainda não estudou as seguintes matérias: {subjects.join(", ")}
      </AlertDescription>
    </Alert>
  );
};