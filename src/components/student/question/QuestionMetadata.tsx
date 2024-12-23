interface QuestionMetadataProps {
  id: string;  // Changed from number to string
  subject?: string;
  topic?: string;
  source?: string;
}

const QuestionMetadata = ({ id, subject, topic, source }: QuestionMetadataProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-primary dark:text-blue-400">
          Q.{id}
        </span>
        {subject && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{subject}</span>
          </>
        )}
        {topic && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{topic}</span>
          </>
        )}
      </div>
      {source && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{source}</span>
      )}
    </div>
  );
};

export default QuestionMetadata;