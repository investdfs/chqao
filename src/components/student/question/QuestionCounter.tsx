import { memo } from 'react';

interface QuestionCounterProps {
  current: number;
  total: number;
}

const QuestionCounter = memo(({ current, total }: QuestionCounterProps) => {
  console.log("Renderizando QuestionCounter:", { current, total });
  
  return (
    <div className="flex items-center justify-center mb-4">
      <span className="text-2xl font-bold bg-gradient-to-r from-accent-purple via-accent-pink to-accent-orange bg-clip-text text-transparent">
        Questão {current} de {total}
      </span>
    </div>
  );
});

QuestionCounter.displayName = 'QuestionCounter';

export default QuestionCounter;