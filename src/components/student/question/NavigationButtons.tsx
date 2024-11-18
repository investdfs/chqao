import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: () => void;
  canAnswer: boolean;
  hasAnswered: boolean;
}

const NavigationButtons = ({
  onPrevious,
  onNext,
  onAnswer,
  canAnswer,
  hasAnswered,
}: NavigationButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Button variant="outline" onClick={onPrevious} className="w-full sm:flex-1">
        ← Anterior
      </Button>

      <Button
        className="w-full sm:flex-1 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={onAnswer}
        disabled={!canAnswer || hasAnswered}
      >
        Responder
      </Button>

      <Button variant="outline" onClick={onNext} className="w-full sm:flex-1">
        Próxima →
      </Button>
    </div>
  );
};

export default NavigationButtons;