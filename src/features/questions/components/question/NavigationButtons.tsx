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
}

const NavigationButtons = memo(({
  onPrevious,
  onNext,
  onAnswer,
  canAnswer,
  hasAnswered,
  questionNumber,
  totalQuestions,
}: NavigationButtonsProps) => {
  console.log("Renderizando NavigationButtons, questionNumber:", questionNumber);

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={questionNumber <= 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {!hasAnswered && (
        <Button
          onClick={onAnswer}
          disabled={!canAnswer}
          className="px-8"
        >
          Responder
        </Button>
      )}

      <Button
        variant={hasAnswered ? "default" : "outline"}
        onClick={onNext}
        disabled={questionNumber >= totalQuestions}
        className="flex items-center gap-2"
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;