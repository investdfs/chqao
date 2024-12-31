import { memo } from 'react';

interface SessionStatsProps {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
}

const SessionStats = memo(({ totalQuestions, correctAnswers, wrongAnswers }: SessionStatsProps) => {
  const percentage = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  return (
    <div className="flex items-center gap-4 text-sm font-medium">
      <span className="text-gray-600 dark:text-gray-300">
        Questões: {totalQuestions}
      </span>
      <span className="text-success dark:text-green-400">
        Acertos: {correctAnswers}
      </span>
      <span className="text-error dark:text-red-400">
        Erros: {wrongAnswers}
      </span>
      <span className={`${
        percentage >= 50 ? 'text-success dark:text-green-400' : 'text-error dark:text-red-400'
      }`}>
        Aproveitamento: {percentage}%
      </span>
    </div>
  );
});

SessionStats.displayName = 'SessionStats';

export default SessionStats;