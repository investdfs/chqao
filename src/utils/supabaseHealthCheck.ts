
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const verifySupabaseHealth = async () => {
  console.log('Iniciando verificação do Supabase...');

  try {
    // Verifica conexão básica
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Falha na conexão com o Supabase');
    }

    // Verifica autenticação
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Erro ao verificar sessão:', authError);
      throw authError;
    }
    console.log('Status da autenticação:', authData.session ? 'Autenticado' : 'Não autenticado');

    // Verifica acesso às tabelas principais usando tipo literal
    const tables = ['students', 'questions', 'subject_structure'] as const;
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Erro ao acessar tabela ${table}:`, error);
        throw new Error(`Falha ao acessar tabela ${table}`);
      }
      console.log(`Tabela ${table} acessível`);
    }

    console.log('Todas as verificações concluídas com sucesso!');
    toast({
      title: "Supabase Operacional",
      description: "Conexão e acesso às tabelas verificados com sucesso.",
    });

    return true;
  } catch (error) {
    console.error('Erro na verificação do Supabase:', error);
    toast({
      title: "Erro na Verificação",
      description: error instanceof Error ? error.message : "Falha ao verificar conexão com Supabase",
      variant: "destructive"
    });
    return false;
  }
};
