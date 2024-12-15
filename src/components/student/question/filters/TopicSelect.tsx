import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TopicSelectProps {
  value: string;
  onChange: (value: string) => void;
  topics: { id: string; name: string }[];
  disabled?: boolean;
}

export const TopicSelect = ({ value, onChange, topics, disabled }: TopicSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Escolha um tópico" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Todos os tópicos</SelectItem>
        {topics.map((topic) => (
          <SelectItem key={topic.id} value={topic.name}>
            {topic.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};