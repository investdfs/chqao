import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  status: 'active' | 'blocked';
  type: 'admin' | 'student';
}

export const useGoogleSheetsData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Buscando usuários do Supabase...');
      
      // Busca administradores
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*');

      if (adminsError) {
        console.error('Erro ao buscar administradores:', adminsError);
        throw adminsError;
      }

      // Busca estudantes
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
        console.error('Erro ao buscar estudantes:', studentsError);
        throw studentsError;
      }

      // Transforma os dados para manter o formato esperado
      const users = [
        ...admins.map(admin => ({
          ...admin,
          type: 'admin' as const
        })),
        ...students.map(student => ({
          ...student,
          type: 'student' as const
        }))
      ];

      console.log('Usuários carregados com sucesso:', users);
      return { users };
    }
  });
};