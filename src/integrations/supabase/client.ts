import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = "https://hletobxssphkhwqpkrif.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZXRvYnhzc3Boa2h3cXBrcmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTAxNjksImV4cCI6MjA0NzE4NjE2OX0.Mfmymw1IESrRtWjZZ7YN0nsfPoisF2V1W0wvkxcR7Sk";

if (!supabaseUrl || !supabaseKey) {
  console.error('Credenciais do Supabase não encontradas');
  toast({
    title: "Erro de configuração",
    description: "Credenciais do banco de dados não encontradas.",
    variant: "destructive"
  });
  throw new Error('Credenciais do Supabase não encontradas');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Interface para tipar o resultado da query
interface QueryResult {
  error?: {
    message: string;
  };
  data?: unknown;
}

// Função helper para verificar conectividade
export const checkSupabaseConnection = async () => {
  try {
    console.log('Verificando conexão com Supabase...');
    
    // Define um timeout de 5 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao conectar com o servidor')), 5000);
    });

    // Tenta fazer uma query simples
    const queryPromise = supabase
      .from('questions')
      .select('count')
      .limit(1)
      .single();

    // Corrida entre o timeout e a query
    const result = await Promise.race([queryPromise, timeoutPromise]) as QueryResult;
    
    // Verifica se o resultado tem erro
    if (result?.error) {
      console.error('Erro ao verificar conexão com Supabase:', result.error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível estabelecer conexão com o servidor. Verifique sua internet.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    toast({
      title: "Erro de conexão",
      description: error instanceof Error ? error.message : "Erro ao conectar com o servidor",
      variant: "destructive"
    });
    return false;
  }
};

// Verificar conexão inicial
checkSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('Sistema pronto para uso');
  } else {
    console.error('Sistema pode apresentar instabilidades');
  }
});