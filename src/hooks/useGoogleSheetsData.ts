import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  status: 'active' | 'blocked';
  type: 'admin' | 'student';
}

export const useGoogleSheetsData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      // Fetch admins
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('*');

      if (adminsError) {
        console.error('Error fetching admins:', adminsError);
        throw adminsError;
      }

      // Fetch students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      // Transform data to match expected format
      const users = [
        ...admins.map(admin => ({
          ...admin,
          type: 'admin' as const
        })),
        ...students.map(student => ({
          ...student,
          type: 'student' as const
        }))
      ];

      console.log('Users fetched successfully:', users);
      return { users };
    }
  });
};