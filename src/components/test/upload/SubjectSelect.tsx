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
  const { data: items, isLoading } = useQuery({
    queryKey: ['subject-structure', type, subjectFilter],
    queryFn: async () => {
      console.log(`Buscando ${type}s do banco...`);
      let query = supabase
        .from('subject_structure')
        .select('*')
        .eq('level', type === 'subject' ? 1 : 2)
        .order('display_order');

      if (type === 'theme' && subjectFilter) {
        const parentNode = await supabase
          .from('subject_structure')
          .select('id')
          .eq('name', subjectFilter)
          .single();

        if (parentNode.data) {
          query = query.eq('parent_id', parentNode.data.id);
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
      }
      
      console.log(`${type}s encontrados:`, data);
      return data.map(item => ({
        id: item.id,
        name: item.name
      }));
    }
  });

  const placeholder = type === 'subject' ? 'Selecione a matéria' : 'Selecione o tema';

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items?.map((item) => (
          <SelectItem key={item.id} value={item.name}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};