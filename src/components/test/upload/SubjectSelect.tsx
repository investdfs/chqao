import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  type: 'subject' | 'theme';
  subjectFilter?: string;
}

export const SubjectSelect = ({ value, onValueChange, type, subjectFilter }: SubjectSelectProps) => {
  const { data: items } = useQuery({
    queryKey: ['subject-structure', type, subjectFilter],
    queryFn: async () => {
      let query = supabase
        .from('subject_structure')
        .select(type)
        .order(type);

      if (type === 'theme' && subjectFilter) {
        query = query.eq('subject', subjectFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Remove duplicates
      const uniqueItems = [...new Set(data.map(item => item[type]))];
      return uniqueItems;
    }
  });

  const placeholder = type === 'subject' ? 'Selecione a matéria' : 'Selecione o tema';

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items?.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};