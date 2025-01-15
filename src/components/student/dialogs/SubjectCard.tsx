import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  questionCount: number;
  onSelect: (subject: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  questionCount,
  onSelect,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{subject}</CardTitle>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {questionCount} {questionCount === 1 ? 'questão' : 'questões'} disponível{questionCount === 1 ? '' : 'is'}
          </p>
          <Button 
            onClick={() => onSelect(subject)}
            variant="outline"
            size="sm"
          >
            Selecionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};