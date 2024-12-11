import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  type: 'subject' | 'theme';
  subjectFilter?: string;
  optional?: boolean;
}

export const SubjectSelect = ({ value, onValueChange, type, subjectFilter, optional = false }: SubjectSelectProps) => {
  const { data: items, isLoading } = useQuery({
    queryKey: ['subject-structure', type, subjectFilter],
    queryFn: async () => {
      console.log(`Buscando ${type}s do banco...`, { type, subjectFilter });
      
      if (type === 'subject') {
        const { data, error } = await supabase
          .from('subject_structure')
          .select('*')
          .eq('level', 1)
          .order('display_order');

        if (error) {
          console.error('Erro ao buscar matérias:', error);
          return [];
        }
        
        console.log('Matérias encontradas:', data);
        return data;
      } else if (type === 'theme' && subjectFilter) {
        const { data, error } = await supabase
          .from('subject_structure')
          .select('*')
          .eq('level', 2)
          .eq('subject', subjectFilter)
          .order('display_order');

        if (error) {
          console.error('Erro ao buscar temas:', error);
          return [];
        }

        console.log('Temas encontrados:', data);
        return data;
      }

      return [];
    },
    enabled: type === 'subject' || (type === 'theme' && !!subjectFilter),
  });

  const placeholder = type === 'subject' ? 'Selecione a matéria' : 'Selecione o tema (opcional)';

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
      <SelectTrigger className="bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {optional && (
          <SelectItem value="none" className="hover:bg-gray-100">
            Nenhum tema selecionado
          </SelectItem>
        )}
        {items && items.length > 0 ? (
          items.map((item) => (
            <SelectItem key={item.id} value={item.name} className="hover:bg-gray-100">
              {item.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-items" disabled>
            Nenhum item encontrado
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};