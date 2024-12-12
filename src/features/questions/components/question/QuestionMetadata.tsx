interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
  className?: string;
  examYear?: number;
  isFromPreviousExam?: boolean;
  examQuestionNumber?: number;
}

const QuestionMetadata = ({ 
  id, 
  subject, 
  topic, 
  source, 
  className = "",
  examYear,
  isFromPreviousExam,
  examQuestionNumber
}: QuestionMetadataProps) => {
  const formatExamQuestionNumber = (num?: number) => {
    if (!num) return '0000';
    return num.toString().padStart(4, '0');
  };

  const examInfo = isFromPreviousExam && examYear 
    ? `EIPS/CHQAO ${examYear} (Q${formatExamQuestionNumber(examQuestionNumber)})`
    : `Q.${id}`;

  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline font-medium text-primary/70 dark:text-blue-400/70">
          {examInfo}
        </span>
        {subject && (
          <span>{subject}</span>
        )}
        {topic && (
          <span className="hidden sm:inline">• {topic}</span>
        )}
      </div>
      {source && (
        <span className="text-[10px]">{source}</span>
      )}
    </div>
  );
};

export default QuestionMetadata;