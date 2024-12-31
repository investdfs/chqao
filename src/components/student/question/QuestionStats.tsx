import { memo } from 'react';

interface QuestionStatsProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

const QuestionStats = memo(({ totalQuestions, correctAnswers, incorrectAnswers }: QuestionStatsProps) => {
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="flex justify-center items-center gap-4 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="font-semibold">Questões: </span>
        <span className="font-bold">{totalQuestions}</span>
      </div>
      
      <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="font-semibold">Acertos: </span>
        <span className="font-bold text-success">{correctAnswers}</span>
      </div>
      
      <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="font-semibold">Erros: </span>
        <span className="font-bold text-error">{incorrectAnswers}</span>
      </div>
      
      <div className="text-center px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="font-semibold">Aproveitamento: </span>
        <span className={`font-bold ${percentage >= 50 ? 'text-success' : 'text-error'}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
});

QuestionStats.displayName = 'QuestionStats';

export default QuestionStats;