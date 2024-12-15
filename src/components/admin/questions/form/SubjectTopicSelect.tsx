import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubjectTopicSelectProps {
  subject: string;
  topic: string;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
}

export const SubjectTopicSelect = ({
  subject,
  topic,
  onSubjectChange,
  onTopicChange
}: SubjectTopicSelectProps) => {
  // Fetch all level 1 items (subjects)
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      console.log('Buscando matérias do banco...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('id, name')
        .eq('level', 1)
        .order('name');

      if (error) {
        console.error('Erro ao buscar matérias:', error);
        throw error;
      }
      console.log('Matérias encontradas:', data);
      return data;
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Matéria *</Label>
        <Select value={subject} onValueChange={onSubjectChange}>
          <SelectTrigger className="bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione a matéria" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {subjects?.map((subject) => (
              <SelectItem 
                key={subject.id} 
                value={subject.name}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Tópico *</Label>
        <Input
          placeholder="Digite o tópico"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="bg-white dark:bg-gray-800"
        />
      </div>
    </div>
  );
};