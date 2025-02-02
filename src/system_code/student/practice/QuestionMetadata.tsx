import { Badge } from "@/components/ui/badge";

interface QuestionMetadataProps {
  id: string;
  subject?: string;
  topic?: string;
  source?: string;
}

const QuestionMetadata = ({ id, subject, topic, source }: QuestionMetadataProps) => {
  return (
    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
      {subject && <Badge variant="outline">{subject}</Badge>}
      {topic && <Badge variant="outline">{topic}</Badge>}
      {source && <Badge variant="outline">{source}</Badge>}
      <span className="text-xs">ID: {id}</span>
    </div>
  );
};

export default QuestionMetadata;