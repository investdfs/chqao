import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResetExamFilters } from "./reset/ResetExamFilters";
import { useResetExam } from "./reset/useResetExam";

interface ResetExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export const ResetExamDialog = ({
  open,
  onOpenChange,
  onReset
}: ResetExamDialogProps) => {
  const {
    isResetting,
    selectedYear,
    selectedSubject,
    availableYears,
    availableSubjects,
    handleYearChange,
    setSelectedSubject,
    handleReset,
  } = useResetExam(onReset);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Reset</DialogTitle>
          <DialogDescription>
            Selecione o ano e opcionalmente a matéria para resetar as provas. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <ResetExamFilters
          selectedYear={selectedYear}
          selectedSubject={selectedSubject}
          availableYears={availableYears}
          availableSubjects={availableSubjects}
          onYearChange={handleYearChange}
          onSubjectChange={setSelectedSubject}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResetting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isResetting || !selectedYear}
          >
            {isResetting ? "Resetando..." : "Confirmar Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};