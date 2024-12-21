import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://hletobxssphkhwqpkrif.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Supabase anon key não encontrada!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: fetch.bind(globalThis)
  }
});

// Função auxiliar para verificar o status da conexão
export const checkSupabaseConnection = async () => {
  try {
    console.log('Verificando conexão com Supabase...');
    const { data, error } = await supabase
      .from('questions')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Erro ao conectar com Supabase:', error);
      throw error;
    }

    console.log('Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
};

// Verificar conexão ao inicializar
checkSupabaseConnection().then((isConnected) => {
  if (!isConnected) {
    console.warn('Não foi possível estabelecer conexão inicial com Supabase');
  }
});