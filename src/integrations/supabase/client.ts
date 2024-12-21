import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://hletobxssphkhwqpkrif.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZXRvYnhzc3Boa2h3cXBrcmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTg4ODAsImV4cCI6MjAyMzA3NDg4MH0.JQh0I-YTiJhOYXEQlnMHBqHOESTXOoE_2wJ_gJLJrYo';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-my-custom-header': 'my-app-name',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

interface QueryResult {
  data: any;
  error: null | Error;
}

// Helper function to check Supabase connectivity
export const checkSupabaseConnection = async () => {
  try {
    console.log('Verificando conexão com Supabase...');
    
    // Define a timeout of 10 seconds
    const timeoutPromise = new Promise<QueryResult>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao conectar com o servidor')), 10000);
    });

    // Try to make a simple query with retry
    const queryPromise = async (): Promise<QueryResult> => {
      for (let i = 0; i < 3; i++) {
        try {
          const { data, error } = await supabase
            .from('questions')
            .select('count')
            .limit(1)
            .single();

          if (error) throw error;
          return { data, error: null };
        } catch (err) {
          if (i === 2) throw err;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
      }
      throw new Error('Todas as tentativas falharam');
    };

    const result = await Promise.race([queryPromise(), timeoutPromise]);
    
    if (result.error) {
      console.error('Erro ao verificar conexão com Supabase:', result.error);
      return false;
    }

    console.log('Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
};