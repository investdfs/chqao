import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTopicRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: ['topic-recommendations', userId],
    queryFn: async () => {
      if (!userId || userId === 'preview-user-id') {
        return [];
      }

      const { data, error } = await supabase
        .rpc('get_topic_recommendations', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching topic recommendations:', error);
        return [];
      }

      return data;
    },
    enabled: !!userId
  });
};