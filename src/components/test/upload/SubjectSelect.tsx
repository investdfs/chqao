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

const availableSubjects = [
  { id: "1", name: "Língua Portuguesa" },
  { id: "2", name: "Geografia do Brasil" },
  { id: "3", name: "História do Brasil" },
  { id: "4", name: "E-1 - Estatuto dos Militares" },
  { id: "5", name: "Licitações e Contratos" },
  { id: "6", name: "Regulamento de Administração do Exército (RAE)" },
  { id: "7", name: "Direito Militar e Sindicância" },
  { id: "8", name: "Código Penal Militar" },
  { id: "9", name: "Código de Processo Penal Militar" },
  { id: "10", name: "Sindicância" },
  { id: "11", name: "Conhecimentos Musicais Gerais" },
  { id: "12", name: "Harmonia Elementar (vocal) e Funcional (instrumental)" },
  { id: "13", name: "Períodos da História da Música" },
  { id: "14", name: "Instrumentação" },
  { id: "15", name: "Canto Modulante" },
  { id: "16", name: "Transcrição" },
];

export const SubjectSelect = ({ value, onValueChange, type, subjectFilter }: SubjectSelectProps) => {
  const { data: items } = useQuery({
    queryKey: ['subject-structure', type, subjectFilter],
    queryFn: async () => {
      console.log(`Buscando ${type}s do banco...`);
      let query = supabase
        .from('subject_structure')
        .select('*')
        .eq('level', type === 'subject' ? 1 : 2);

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
      if (error) throw error;
      
      console.log(`${type}s encontrados:`, data);
      return data.map(item => item.name);
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