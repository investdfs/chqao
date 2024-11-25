import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const SubjectSelect = ({ value, onValueChange }: SubjectSelectProps) => {
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_structure')
        .select('subject')
        .order('subject');

      if (error) throw error;
      
      // Remove duplicates
      const uniqueSubjects = [...new Set(data.map(item => item.subject))];
      return uniqueSubjects;
    }
  });

  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
};