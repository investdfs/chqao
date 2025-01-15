import React from 'react';

interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
  className?: string;
  examYear?: number;
  isFromPreviousExam?: boolean;
  showId?: boolean;
  theme?: string;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
}

const QuestionMetadata = ({ 
  id,
  subject,
  topic,
  source,
  className = "",
  examYear,
  isFromPreviousExam,
  showId = true,
  theme,
  difficulty
}: QuestionMetadataProps) => {
  const examInfo = isFromPreviousExam && examYear 
    ? `EIPS/CHQAO ${examYear} (Q${id.toString().padStart(4, '0')})`
    : `Q.${id}`;

  const hierarchyDisplay = [subject, theme, topic, difficulty]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <div className="flex items-center gap-2">
        {showId && (
          <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {examInfo}
          </span>
        )}
        <span>{hierarchyDisplay}</span>
      </div>
      {source && (
        <span className="text-[10px]">{source}</span>
      )}
    </div>
  );
};

export default QuestionMetadata;