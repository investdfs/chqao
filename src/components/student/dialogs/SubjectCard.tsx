import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium">{subject}</h4>
            <p className="text-xs text-muted-foreground">
              {questionCount} {questionCount === 1 ? 'questão' : 'questões'}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => onSelect(subject)}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          Selecionar
        </Button>
      </CardContent>
    </Card>
  );
};