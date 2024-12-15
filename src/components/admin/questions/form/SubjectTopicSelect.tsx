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

  const { data: topics } = useQuery({
    queryKey: ['subject-structure-topics', subject],
    queryFn: async () => {
      if (!subject) return [];

      console.log('Buscando tópicos para a matéria:', subject);
      const { data: subjectData, error: subjectError } = await supabase
        .from('subject_structure')
        .select('id')
        .eq('level', 1)
        .eq('name', subject)
        .single();

      if (subjectError || !subjectData) {
        console.error('Erro ao buscar matéria:', subjectError);
        return [];
      }

      const { data: topicsData, error: topicsError } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('level', 2)
        .eq('parent_id', subjectData.id)
        .order('name');

      if (topicsError) {
        console.error('Erro ao buscar tópicos:', topicsError);
        return [];
      }

      return topicsData?.map(item => item.name) || [];
    },
    enabled: !!subject
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
                key={subject} 
                value={subject}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Tópico *</Label>
        <div className="flex gap-2">
          <Select
            value={topics?.includes(topic) ? topic : ""}
            onValueChange={onTopicChange}
          >
            <SelectTrigger className="flex-1 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Selecione o tópico" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {topics?.map((topic) => (
                <SelectItem 
                  key={topic} 
                  value={topic}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Ou digite um novo tópico"
            value={!topics?.includes(topic) ? topic : ""}
            onChange={(e) => onTopicChange(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};