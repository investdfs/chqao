import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDetailedStats } from "@/hooks/useDetailedStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, BarChart2 } from "lucide-react";

export const DetailedStatsPanel = () => {
  const { detailedStats, subjectSummary, isLoading } = useDetailedStats();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Estatísticas Detalhadas
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

  const groupedStats = detailedStats?.reduce((acc, stat) => {
    if (!acc[stat.subject]) {
      acc[stat.subject] = [];
    }
    acc[stat.subject].push(stat);
    return acc;
  }, {} as Record<string, typeof detailedStats>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Estatísticas Detalhadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="detailed">Detalhado</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ativas</TableHead>
                  <TableHead>Provas</TableHead>
                  <TableHead>Temas</TableHead>
                  <TableHead>Tópicos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectSummary?.map((summary) => (
                  <TableRow key={summary.subject}>
                    <TableCell className="font-medium">{summary.subject}</TableCell>
                    <TableCell>{summary.total_questions}</TableCell>
                    <TableCell>{summary.active_questions}</TableCell>
                    <TableCell>{summary.exam_questions}</TableCell>
                    <TableCell>{summary.theme_count}</TableCell>
                    <TableCell>{summary.topic_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-4">
              {Object.entries(groupedStats || {}).map(([subject, stats]) => (
                <div key={subject} className="border rounded-lg p-4">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleSubject(subject)}
                  >
                    {expandedSubjects.includes(subject) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="text-lg font-semibold">{subject}</h3>
                  </div>

                  {expandedSubjects.includes(subject) && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tema/Tópico</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Ativas</TableHead>
                            <TableHead>Provas</TableHead>
                            <TableHead>Dificuldade Média</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.map((stat, index) => (
                            <TableRow key={`${stat.theme}-${stat.topic}-${index}`}>
                              <TableCell>
                                <div className="font-medium">{stat.theme}</div>
                                <div className="text-sm text-gray-500">{stat.topic}</div>
                              </TableCell>
                              <TableCell>{stat.total_questions}</TableCell>
                              <TableCell>{stat.active_questions}</TableCell>
                              <TableCell>{stat.exam_questions}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={((stat.avg_difficulty - 1) / 2) * 100}
                                    className="w-20"
                                  />
                                  <span className="text-sm">
                                    {stat.avg_difficulty.toFixed(1)}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};