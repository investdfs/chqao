interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
}

const QuestionMetadata = ({ id, subject, topic, source }: QuestionMetadataProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="hidden sm:inline text-sm font-medium text-primary dark:text-blue-400">
          Q.{id}
        </span>
        {subject && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {subject}
          </span>
        )}
        {topic && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
            {topic}
          </span>
        )}
      </div>
      {source && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
          {source}
        </span>
      )}
    </div>
  );
};

export default QuestionMetadata;