import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JsonInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const JsonInputField = ({ value, onChange }: JsonInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="json">JSON das Questões *</Label>
      <Textarea
        id="json"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole o JSON das questões aqui..."
        className="min-h-[200px] font-mono"
      />
    </div>
  );
};