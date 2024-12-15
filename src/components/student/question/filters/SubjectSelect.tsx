import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  subjects: { id: string; name: string }[];
  disabled?: boolean;
}

export const SubjectSelect = ({ value, onChange, subjects, disabled }: SubjectSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Escolha uma matéria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Todas as matérias</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject.id} value={subject.name}>
            {subject.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};