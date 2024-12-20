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
      
      // First get all students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name, email');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      // Then get login data for each student
      const { data: logins, error: loginsError } = await supabase
        .from('student_logins')
        .select('student_id, login_date')
        .order('login_date', { ascending: false });

      if (loginsError) {
        console.error('Error fetching student logins:', loginsError);
        throw loginsError;
      }

      // Process the data to get the last login and total logins for each student
      const studentMap = new Map<string, LoginData>();

      students.forEach((student) => {
        const studentLogins = logins.filter(login => login.student_id === student.id);
        
        if (studentLogins.length > 0) {
          studentMap.set(student.id, {
            id: student.id,
            name: student.name,
            email: student.email,
            lastLogin: studentLogins[0].login_date,
            totalLogins: studentLogins.length
          });
        }
      });

      console.log('Processed login data:', Array.from(studentMap.values()));
      return Array.from(studentMap.values());
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  return {
    loginData,
    isLoading
  };
};