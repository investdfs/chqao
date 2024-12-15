import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionCountSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const QuestionCountSelect = ({ value, onChange }: QuestionCountSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Número de questões" />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 15, 20, 25, 30].map((count) => (
          <SelectItem key={count} value={String(count)}>
            {count} questões
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};