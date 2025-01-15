import { memo } from 'react';

interface QuestionCounterProps {
  current: number;
  total: number;
}

const QuestionCounter = memo(({ current, total }: QuestionCounterProps) => {
  console.log("Renderizando QuestionCounter:", { current, total });
  
  return (
    <span className="font-bold text-gray-900 dark:text-gray-100">
      Questão {current} de {total} |{' '}
    </span>
  );
});

QuestionCounter.displayName = 'QuestionCounter';

export default QuestionCounter;