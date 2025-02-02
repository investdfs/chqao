import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StudyOptionsProps {
  skipCompleted: boolean;
  onSkipCompletedChange: (checked: boolean) => void;
  prioritizeErrors: boolean;
  onPrioritizeErrorsChange: (checked: boolean) => void;
}

export const StudyOptions = ({
  skipCompleted,
  onSkipCompletedChange,
  prioritizeErrors,
  onPrioritizeErrorsChange,
}: StudyOptionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id="skipCompleted"
          checked={skipCompleted}
          onCheckedChange={onSkipCompletedChange}
        />
        <Label htmlFor="skipCompleted" className="text-sm sm:text-base">
          Pular questões já realizadas
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="prioritizeErrors"
          checked={prioritizeErrors}
          onCheckedChange={onPrioritizeErrorsChange}
        />
        <Label htmlFor="prioritizeErrors" className="text-sm sm:text-base">
          Priorizar questões erradas
        </Label>
      </div>
    </div>
  );
};