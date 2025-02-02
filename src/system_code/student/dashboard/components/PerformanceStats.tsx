import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePerformanceStats = (userId: string | null) => {
  return useQuery({
    queryKey: ['performance-stats', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching performance stats:', error);
        return [];
      }

      return data;
    },
    enabled: !!userId
  });
};