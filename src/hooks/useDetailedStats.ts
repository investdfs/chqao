import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DetailedStats {
  subject: string;
  theme: string;
  topic: string;
  total_questions: number;
  active_questions: number;
  exam_questions: number;
  avg_difficulty: number;
}

export interface SubjectSummary {
  subject: string;
  total_questions: number;
  active_questions: number;
  exam_questions: number;
  theme_count: number;
  topic_count: number;
}

export const useDetailedStats = () => {
  const { data: detailedStats, isLoading: isLoadingDetailed } = useQuery({
    queryKey: ['detailed-stats'],
    queryFn: async () => {
      console.log('Fetching detailed statistics...');
      const { data, error } = await supabase
        .rpc('get_detailed_question_stats');

      if (error) {
        console.error('Error fetching detailed stats:', error);
        throw error;
      }

      return data as DetailedStats[];
    },
    refetchInterval: 5000
  });

  const { data: subjectSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['subject-summary'],
    queryFn: async () => {
      console.log('Fetching subject summary...');
      const { data, error } = await supabase
        .rpc('get_subject_summary');

      if (error) {
        console.error('Error fetching subject summary:', error);
        throw error;
      }

      return data as SubjectSummary[];
    },
    refetchInterval: 5000
  });

  return {
    detailedStats,
    subjectSummary,
    isLoading: isLoadingDetailed || isLoadingSummary
  };
};