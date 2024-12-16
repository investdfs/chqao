import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://hletobxssphkhwqpkrif.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZXRvYnhzc3Boa2h3cXBrcmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTAxNjksImV4cCI6MjA0NzE4NjE2OX0.Mfmymw1IESrRtWjZZ7YN0nsfPoisF2V1W0wvkxcR7Sk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined');
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
  }
});

// Helper function to check connectivity
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Erro ao verificar conexão com Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao tentar conectar com Supabase:', error);
    return false;
  }
};