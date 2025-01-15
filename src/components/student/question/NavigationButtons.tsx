import { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: () => void;
  canAnswer: boolean;
  hasAnswered: boolean;
  questionNumber: number;
  totalQuestions: number;
  isAnswering?: boolean;
  onJumpToQuestion?: (questionNumber: number) => void;
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
  onJumpToQuestion
}: NavigationButtonsProps) => {
  const [jumpToNumber, setJumpToNumber] = useState<string>('');
  const { toast } = useToast();

  console.log("Renderizando NavigationButtons, questionNumber:", questionNumber);

  const handleJumpToQuestion = () => {
    const number = parseInt(jumpToNumber);
    if (isNaN(number) || number < 1 || number > totalQuestions) {
      toast({
        variant: "destructive",
        title: "Número inválido",
        description: `Digite um número entre 1 e ${totalQuestions}`,
      });
      return;
    }
    onJumpToQuestion?.(number);
    setJumpToNumber('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
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
            hasAnswered ? "bg-primary hover:bg-primary/90 text-white shadow-md" : ""
          }`}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Input
          type="number"
          min={1}
          max={totalQuestions}
          value={jumpToNumber}
          onChange={(e) => setJumpToNumber(e.target.value)}
          placeholder="Ir para questão..."
          className="w-40"
        />
        <Button 
          variant="outline" 
          onClick={handleJumpToQuestion}
          disabled={!jumpToNumber}
        >
          Ir
        </Button>
      </div>
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;