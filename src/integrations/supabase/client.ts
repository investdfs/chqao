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
    detectSessionInUrl: true
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

// Helper function to check connectivity
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    const { data, error } = await supabase
      .from('questions')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error checking Supabase connection:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
};