import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";

interface MobileFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const MobileFeedbackDialog = ({
  open,
  onOpenChange,
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: MobileFeedbackDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] p-0 gap-0">
        <div className={`p-4 ${
          isCorrect
            ? "bg-success-light dark:bg-blue-900/30"
            : "bg-error-light dark:bg-red-900/30"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <Check className="h-5 w-5 text-success dark:text-blue-400" />
                <span className="font-medium text-success dark:text-blue-400">
                  Você acertou! 🎉
                </span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-error dark:text-red-400" />
                <span className="font-medium text-error dark:text-red-400">
                  Você errou! ⚠️
                </span>
              </>
            )}
          </div>
          <p className="text-sm dark:text-gray-300">
            Resposta correta: {correctAnswer}
          </p>
        </div>

        <div className="p-4">
          <p className="text-sm dark:text-gray-300">{explanation}</p>
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-1"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileFeedbackDialog;