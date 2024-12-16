import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubjectTopicFieldsProps {
  subject: string;
  topic: string;
  onInputChange: (field: string, value: string) => void;
  isOptional?: boolean;
  helperText?: string;
}

export const SubjectTopicFields = ({ 
  subject, 
  topic, 
  onInputChange,
  isOptional = false,
  helperText
}: SubjectTopicFieldsProps) => {
  const { data: subjects } = useQuery({
    queryKey: ['subject-structure-subjects'],
    queryFn: async () => {
      console.log('Buscando matérias do banco...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('level', 1)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    }
  });

  return (
    <div className="space-y-4">
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">
            Matéria {!isOptional && '*'}
            {isOptional && ' (opcional)'}
          </Label>
          <Select
            value={subject}
            onValueChange={(value) => onInputChange("subject", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">
            Tópico {!isOptional && '*'}
            {isOptional && ' (opcional)'}
          </Label>
          <Input
            placeholder="Digite o tópico"
            value={topic}
            onChange={(e) => onInputChange("topic", e.target.value)}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
};