import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export const useGoogleSheetsData = () => {
  return useQuery({
    queryKey: ['sheetsData'],
    queryFn: async () => {
      const { data: functionData, error } = await supabase.functions.invoke('google-sheets')
      
      if (error) {
        throw new Error('Erro ao buscar dados do Google Sheets')
      }
      
      return functionData
    },
  })
}