interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
  examYear?: number;
  isFromPreviousExam?: boolean;
  showId?: boolean;
}

const QuestionMetadata = ({ 
  id, 
  subject, 
  topic, 
  source,
  examYear,
  isFromPreviousExam,
  showId = true
}: QuestionMetadataProps) => {
  const examInfo = isFromPreviousExam && examYear 
    ? `EIPS/CHQAO ${examYear} (Q${id.toString().padStart(4, '0')})`
    : `Q.${id}`;

  return (
    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        {showId && (
          <span className="hidden sm:inline font-medium text-primary/70 dark:text-blue-400/70">
            {examInfo}
          </span>
        )}
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