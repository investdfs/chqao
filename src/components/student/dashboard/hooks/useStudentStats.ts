import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudyStats, SyllabusProgress, WeeklyStudyData } from "@/types/database/functions";

export const useStudentStats = (userId: string | undefined) => {
  const { data: studyStats } = useQuery({
    queryKey: ['studyStats', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .rpc('get_study_stats', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching study stats:', error);
        return null;
      }

      return data[0] as StudyStats;
    },
    enabled: !!userId,
  });

  const { data: syllabusProgress } = useQuery({
    queryKey: ['syllabusProgress', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .rpc('get_syllabus_progress', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching syllabus progress:', error);
        return null;
      }

      return data[0] as SyllabusProgress;
    },
    enabled: !!userId,
  });

  const { data: weeklyStudyData } = useQuery({
    queryKey: ['weeklyStudyData', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .rpc('get_weekly_study_data', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching weekly study data:', error);
        return null;
      }

      return data as WeeklyStudyData[];
    },
    enabled: !!userId,
  });

  return {
    studyStats,
    syllabusProgress,
    weeklyStudyData,
  };
};