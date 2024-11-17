import { useQuery } from '@tanstack/react-query';
import { fetchSheetData } from '@/integrations/sheetdb/client';

export const useGoogleSheetsData = () => {
  return useQuery({
    queryKey: ['sheetsData'],
    queryFn: async () => {
      const data = await fetchSheetData();
      
      // Separar os dados em usuários e questões
      const users = data.filter((row: any) => row.type === 'admin' || row.type === 'student');
      const questions = data.filter((row: any) => row.type === 'question');
      
      return {
        users,
        questions
      };
    },
  });
};