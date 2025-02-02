import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ThemeSelectProps {
  value: string;
  onChange: (value: string) => void;
  themes: { id: string; name: string }[];
  disabled?: boolean;
}

export const ThemeSelect = ({ value, onChange, themes, disabled }: ThemeSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Escolha um tema" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Todos os temas</SelectItem>
        {themes.map((theme) => (
          <SelectItem key={theme.id} value={theme.name}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};