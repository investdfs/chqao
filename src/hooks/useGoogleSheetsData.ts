import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  status: 'active' | 'blocked';
  type: 'admin' | 'student';
}

export const useGoogleSheetsData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Iniciando busca de usuários...');
      
      // Busca administradores
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*')
        .order('name');

      if (adminsError) {
        console.error('Erro ao buscar administradores:', adminsError);
        toast({
          title: "Erro ao carregar administradores",
          description: "Não foi possível carregar a lista de administradores.",
          variant: "destructive",
        });
        throw adminsError;
      }

      console.log('Administradores encontrados:', admins?.length || 0);

      // Busca estudantes
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (studentsError) {
        console.error('Erro ao buscar estudantes:', studentsError);
        toast({
          title: "Erro ao carregar estudantes",
          description: "Não foi possível carregar a lista de estudantes.",
          variant: "destructive",
        });
        throw studentsError;
      }

      console.log('Estudantes encontrados:', students?.length || 0);

      // Combina os resultados
      const users: User[] = [
        ...(admins || []).map(admin => ({
          ...admin,
          type: 'admin' as const
        })),
        ...(students || []).map(student => ({
          ...student,
          type: 'student' as const
        }))
      ];

      console.log('Total de usuários carregados:', users.length);
      
      if (users.length === 0) {
        console.log('Nenhum usuário encontrado. Verifique as políticas de RLS.');
      }
      
      return { users };
    },
    refetchInterval: 5000,
    staleTime: 3000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};