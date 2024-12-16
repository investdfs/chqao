interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
  className?: string;
  examYear?: number;
  isFromPreviousExam?: boolean;
  showId?: boolean; // New prop to control ID visibility
  secondaryId?: string; // New prop for the secondary ID
}

const QuestionMetadata = ({ 
  id, 
  subject, 
  topic, 
  source, 
  className = "",
  examYear,
  isFromPreviousExam,
  showId = true, // Default to true to maintain existing behavior
  secondaryId
}: QuestionMetadataProps) => {
  const examInfo = isFromPreviousExam && examYear 
    ? `EIPS/CHQAO ${examYear} (Q${id.toString().padStart(4, '0')})`
    : secondaryId || `Q.${id}`;

  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${className}`}>
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