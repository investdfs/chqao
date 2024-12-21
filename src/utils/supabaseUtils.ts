import { PostgrestError } from '@supabase/supabase-js';

export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export const isSupabaseError = (error: unknown): error is PostgrestError => {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
};

export const handleSupabaseError = (error: unknown): string => {
  if (isSupabaseError(error)) {
    return error.message;
  }
  return 'Ocorreu um erro desconhecido';
};

export const ensureArray = <T>(data: T | T[] | null): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};