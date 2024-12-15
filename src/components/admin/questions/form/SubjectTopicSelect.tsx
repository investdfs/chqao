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

  // Fetch topics for selected subject
  const { data: topics } = useQuery({
    queryKey: ['topics', subject],
    queryFn: async () => {
      if (!subject) return [];

      console.log('Buscando tópicos para a matéria:', subject);
      
      const { data: hierarchyData, error: hierarchyError } = await supabase
        .rpc('get_subject_hierarchy');

      if (hierarchyError) {
        console.error('Erro ao buscar hierarquia:', hierarchyError);
        return [];
      }

      console.log('Hierarquia completa:', hierarchyData);

      // Find the selected subject in the hierarchy
      const selectedSubject = hierarchyData.find(item => item.name === subject);
      if (!selectedSubject) {
        console.log('Matéria não encontrada na hierarquia:', subject);
        return [];
      }

      console.log('Matéria selecionada:', selectedSubject);

      // Recursive function to get all descendants of a node
      const getAllDescendants = (parentId: string): typeof hierarchyData => {
        const children = hierarchyData.filter(item => item.parent_id === parentId);
        let descendants = [...children];
        
        for (const child of children) {
          descendants = [...descendants, ...getAllDescendants(child.id)];
        }
        
        return descendants;
      };

      // Get all descendants of the selected subject
      const allDescendants = getAllDescendants(selectedSubject.id);
      console.log('Todos os descendentes:', allDescendants);

      // Filter to get only leaf nodes (topics that have no children)
      const leafTopics = allDescendants.filter(item => 
        !hierarchyData.some(other => other.parent_id === item.id)
      );

      console.log('Tópicos finais encontrados:', leafTopics);
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