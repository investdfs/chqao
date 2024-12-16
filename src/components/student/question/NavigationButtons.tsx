import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: () => void;
  canAnswer: boolean;
  hasAnswered: boolean;
  questionNumber: number;
  totalQuestions: number;
  isAnswering?: boolean;
}

const NavigationButtons = memo(({
  onPrevious,
  onNext,
  onAnswer,
  canAnswer,
  hasAnswered,
  questionNumber,
  totalQuestions,
  isAnswering = false,
}: NavigationButtonsProps) => {
  console.log("Renderizando NavigationButtons, questionNumber:", questionNumber);

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={questionNumber <= 1 || isAnswering}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {!hasAnswered && (
        <Button
          onClick={onAnswer}
          disabled={!canAnswer || isAnswering}
          className="px-8 min-w-[120px]"
        >
          {isAnswering ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verificando
            </>
          ) : (
            'Responder'
          )}
        </Button>
      )}

      <Button
        variant={hasAnswered ? "default" : "outline"}
        onClick={onNext}
        disabled={questionNumber >= totalQuestions || isAnswering}
        className={`flex items-center gap-2 ${
          hasAnswered ? "bg-primary hover:bg-primary/90 text-white animate-pulse" : ""
        }`}
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;