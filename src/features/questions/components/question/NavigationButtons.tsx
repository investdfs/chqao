import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: () => void;
  canAnswer: boolean;
  hasAnswered: boolean;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
}

const NavigationButtons = memo(({
  onPrevious,
  onNext,
  onAnswer,
  canAnswer,
  hasAnswered,
  questionNumber,
  totalQuestions,
  className = ""
}: NavigationButtonsProps) => {
  console.log("Renderizando NavigationButtons, questionNumber:", questionNumber);

  return (
    <div className={`flex justify-between items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={questionNumber <= 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {!hasAnswered && (
        <Button
          size="sm"
          onClick={onAnswer}
          disabled={!canAnswer}
          className="px-4 sm:px-8"
        >
          Responder
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={questionNumber >= totalQuestions}
        className="flex items-center gap-1"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;