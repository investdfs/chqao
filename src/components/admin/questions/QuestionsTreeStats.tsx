import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronDown, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface TreeNode {
  name: string;
  count: number;
  children?: TreeNode[];
}

export const QuestionsTreeStats = () => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const { data: questionsStats, isLoading } = useQuery({
    queryKey: ['questions-tree-stats'],
    queryFn: async () => {
      console.log('Fetching questions stats...');
      
      // Get questions grouped by subject and topic
      const { data: questions, error } = await supabase
        .from('questions')
        .select('subject, topic, id')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      // Process the data to create subject/topic hierarchy
      const subjectMap = new Map<string, Map<string, number>>();

      questions.forEach(q => {
        if (!subjectMap.has(q.subject)) {
          subjectMap.set(q.subject, new Map());
        }
        
        const topicMap = subjectMap.get(q.subject)!;
        const topic = q.topic || 'Sem tópico';
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
      });

      // Convert to tree structure
      const tree: TreeNode[] = [];
      subjectMap.forEach((topicMap, subject) => {
        const subjectNode: TreeNode = {
          name: subject,
          count: Array.from(topicMap.values()).reduce((a, b) => a + b, 0),
          children: []
        };

        topicMap.forEach((count, topic) => {
          subjectNode.children?.push({
            name: topic,
            count: count
          });
        });

        tree.push(subjectNode);
      });

      return tree;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Estatísticas de Questões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-8 bg-gray-200 rounded-lg w-2/3" />
            <div className="h-8 bg-gray-200 rounded-lg w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          Estatísticas de Questões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {questionsStats?.map((node, index) => (
          <div key={index} className="animate-fade-in">
            <div
              className="flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer hover:bg-primary/5"
              onClick={() => setExpandedNodes(prev => 
                prev.includes(index.toString())
                  ? prev.filter(p => p !== index.toString())
                  : [...prev, index.toString()]
              )}
            >
              {expandedNodes.includes(index.toString()) ? (
                <ChevronDown className="h-4 w-4 text-primary/70" />
              ) : (
                <ChevronRight className="h-4 w-4 text-primary/70" />
              )}
              <span className="flex-1 text-gray-700">{node.name}</span>
              <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {node.count} questões
              </span>
            </div>
            
            {expandedNodes.includes(index.toString()) && node.children && (
              <div className="ml-4 border-l-2 border-primary/10">
                {node.children.map((child, childIndex) => (
                  <div
                    key={childIndex}
                    className="flex items-center gap-2 p-2 pl-8"
                  >
                    <span className="flex-1 text-gray-700">{child.name}</span>
                    <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {child.count} questões
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
