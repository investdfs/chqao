import { useQuery } from '@tanstack/react-query';
import { fetchSheetData } from '@/integrations/sheetdb/client';

export interface User {
  id: string;
  email: string;
  password: string;
  status: string;
  type: 'admin' | 'student';
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  explanation: string;
}

export const useGoogleSheetsData = () => {
  return useQuery({
    queryKey: ['sheetsData'],
    queryFn: async () => {
      const data = await fetchSheetData();
      
      // Separar os dados em usuários e questões
      const users = data.filter((row: any) => row.type === 'admin' || row.type === 'student') as User[];
      const questions = data.filter((row: any) => !row.type) as Question[];
      
      return {
        users,
        questions
      };
    },
  });
};