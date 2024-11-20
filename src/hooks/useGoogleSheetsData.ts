import { useQuery } from '@tanstack/react-query';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
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
      console.log('Verificando conexão com Supabase...');
      
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        });
        throw new Error('Falha na conexão com o Supabase');
      }

      console.log('Buscando usuários do Supabase...');
      
      // Busca administradores com retry
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*')
        .throwOnError();

      if (adminsError) {
        console.error('Erro ao buscar administradores:', adminsError);
        toast({
          title: "Erro ao carregar administradores",
          description: "Não foi possível carregar a lista de administradores.",
          variant: "destructive",
        });
        throw adminsError;
      }

      // Busca estudantes com retry
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .throwOnError();

      if (studentsError) {
        console.error('Erro ao buscar estudantes:', studentsError);
        toast({
          title: "Erro ao carregar estudantes",
          description: "Não foi possível carregar a lista de estudantes.",
          variant: "destructive",
        });
        throw studentsError;
      }

      // Transforma os dados para manter o formato esperado
      const users = [
        ...(admins || []).map(admin => ({
          ...admin,
          type: 'admin' as const
        })),
        ...(students || []).map(student => ({
          ...student,
          type: 'student' as const
        }))
      ];

      console.log('Usuários carregados com sucesso:', users);
      return { users };
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};