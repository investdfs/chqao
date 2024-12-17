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
      const { data, error } = await supabase
        .rpc('get_questions_stats');

      if (error) {
        console.error('Error fetching questions stats:', error);
        throw error;
      }

      console.log('Questions stats data:', data);
      return data;
    },
    refetchInterval: 5000 // Atualiza a cada 5 segundos
  });

  const buildTree = (data: any[]) => {
    if (!data) return [];
    
    const tree: TreeNode[] = [];
    const subjects = new Map<string, { themes: Map<string, Set<string>>, count: number }>();

    // Group questions by subject, theme, and topic
    data.forEach(q => {
      if (!subjects.has(q.subject)) {
        subjects.set(q.subject, { themes: new Map(), count: 0 });
      }
      const subject = subjects.get(q.subject)!;
      subject.count += q.count || 0;

      if (q.theme) {
        if (!subject.themes.has(q.theme)) {
          subject.themes.set(q.theme, new Set());
        }
        if (q.topic) {
          subject.themes.get(q.theme)!.add(q.topic);
        }
      }
    });

    // Build tree structure
    subjects.forEach((subjectData, subjectName) => {
      const subjectNode: TreeNode = {
        name: subjectName,
        count: subjectData.count,
        children: []
      };

      subjectData.themes.forEach((topics, themeName) => {
        const themeCount = data
          .filter(q => q.theme === themeName)
          .reduce((sum, q) => sum + (q.count || 0), 0);

        const themeNode: TreeNode = {
          name: themeName,
          count: themeCount,
          children: Array.from(topics).map(topicName => ({
            name: topicName,
            count: data
              .filter(q => q.topic === topicName)
              .reduce((sum, q) => sum + (q.count || 0), 0)
          }))
        };
        subjectNode.children?.push(themeNode);
      });

      tree.push(subjectNode);
    });

    console.log('Built tree structure:', tree);
    return tree;
  };

  const toggleNode = (nodePath: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodePath)
        ? prev.filter(p => p !== nodePath)
        : [...prev, nodePath]
    );
  };

  const renderNode = (node: TreeNode, path: string = '', level: number = 0) => {
    const isExpanded = expandedNodes.includes(path);
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = `${level * 1.5}rem`;

    return (
      <div key={path} className="animate-fade-in">
        <div
          className={`
            flex items-center gap-2 p-2 rounded-lg transition-all
            ${hasChildren ? 'cursor-pointer hover:bg-primary/5' : 'pl-8'}
          `}
          style={{ paddingLeft }}
          onClick={() => hasChildren && toggleNode(path)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-primary/70" />
            ) : (
              <ChevronRight className="h-4 w-4 text-primary/70" />
            )
          ) : (
            <div className="w-4" /> // Spacing for alignment
          )}
          <span className="flex-1 text-gray-700">{node.name}</span>
          <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {node.count} questões
          </span>
        </div>
        
        {isExpanded && node.children && (
          <div className="ml-4 border-l-2 border-primary/10">
            {node.children.map((child, index) =>
              renderNode(child, `${path}-${index}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

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

  const treeData = buildTree(questionsStats || []);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          Estatísticas de Questões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {treeData.map((node, index) => renderNode(node, index.toString()))}
      </CardContent>
    </Card>
  );
};