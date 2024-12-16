import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LoginData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  totalLogins: number;
}

export const useLoginControl = () => {
  const { data: loginData = [], isLoading } = useQuery({
    queryKey: ['student-logins'],
    queryFn: async () => {
      console.log('Fetching student login data...');
      
      const { data: logins, error } = await supabase
        .from('student_logins')
        .select(`
          student_id,
          login_date,
          students (
            id,
            name,
            email
          )
        `)
        .order('login_date', { ascending: false });

      if (error) {
        console.error('Error fetching student logins:', error);
        throw error;
      }

      // Process the data to get the last login and total logins for each student
      const studentMap = new Map<string, LoginData>();

      logins.forEach((login) => {
        const studentId = login.student_id;
        const student = login.students;

        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: studentId,
            name: student.name,
            email: student.email,
            lastLogin: login.login_date,
            totalLogins: 1
          });
        } else {
          const existing = studentMap.get(studentId)!;
          studentMap.set(studentId, {
            ...existing,
            totalLogins: existing.totalLogins + 1
          });
        }
      });

      console.log('Processed login data:', Array.from(studentMap.values()));
      return Array.from(studentMap.values());
    }
  });

  return {
    loginData,
    isLoading
  };
};