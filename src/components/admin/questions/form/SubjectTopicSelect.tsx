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
      return data;
    }
  });

  // Fetch topics for selected subject
  const { data: topics } = useQuery({
    queryKey: ['topics', subject],
    queryFn: async () => {
      if (!subject) return [];

      console.log('Buscando tópicos para a matéria:', subject);
      
      // First, get all topics from the hierarchy
      const { data: hierarchyData, error: hierarchyError } = await supabase
        .rpc('get_subject_hierarchy');

      if (hierarchyError) {
        console.error('Erro ao buscar hierarquia:', hierarchyError);
        return [];
      }

      // Find the selected subject in the hierarchy
      const selectedSubject = hierarchyData.find(item => item.name === subject);
      if (!selectedSubject) {
        console.log('Matéria não encontrada na hierarquia:', subject);
        return [];
      }

      // Filter to get all descendants that are leaf nodes (no children)
      const leafTopics = hierarchyData.filter(item => 
        !item.has_children && // Is a leaf node
        item.level > selectedSubject.level && // Is a descendant
        // Check if this item is under our selected subject in the hierarchy
        (function isDescendant(itemId: string): boolean {
          const item = hierarchyData.find(h => h.id === itemId);
          if (!item) return false;
          if (item.parent_id === selectedSubject.id) return true;
          if (!item.parent_id) return false;
          return isDescendant(item.parent_id);
        })(item.id)
      );

      console.log('Tópicos encontrados:', leafTopics);
      return leafTopics;
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
        <div className="flex gap-2">
          <Select
            value={topics?.some(t => t.name === topic) ? topic : ""}
            onValueChange={onTopicChange}
          >
            <SelectTrigger className="flex-1 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Selecione o tópico" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 max-h-[300px]">
              {topics?.map((topic) => (
                <SelectItem 
                  key={topic.id} 
                  value={topic.name}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Ou digite um novo tópico"
            value={!topics?.some(t => t.name === topic) ? topic : ""}
            onChange={(e) => onTopicChange(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};