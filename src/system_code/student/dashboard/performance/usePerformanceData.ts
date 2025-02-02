import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePerformanceData = (userId?: string) => {
  return useQuery({
    queryKey: ['performance-data', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id') {
        return [];
      }

      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching performance data:', error);
        return [];
      }

      return data;
    },
    enabled: !!userId
  });
};