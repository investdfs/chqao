import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://hletobxssphkhwqpkrif.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Erro crítico: NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    fetch: fetch.bind(globalThis)
  }
});

// Função para verificar a conexão e autenticação
export const checkSupabaseConnection = async () => {
  try {
    console.log('Verificando conexão com Supabase...');
    
    // Verifica se há uma sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      return false;
    }

    if (!session) {
      console.warn('Nenhuma sessão ativa encontrada');
      return false;
    }

    console.log('Sessão ativa encontrada para:', session.user.email);

    // Tenta fazer uma query simples para verificar a conexão
    const { error: queryError } = await supabase
      .from('questions')
      .select('id')
      .limit(1);

    if (queryError) {
      console.error('Erro ao testar conexão:', queryError);
      return false;
    }

    console.log('Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
};

// Verifica conexão ao inicializar
checkSupabaseConnection().then((isConnected) => {
  if (!isConnected) {
    console.warn('Não foi possível estabelecer conexão inicial com Supabase');
  }
});