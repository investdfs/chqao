import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudyStats, SyllabusProgress, WeeklyStudyData } from "@/types/database/functions";
import { useToast } from "@/hooks/use-toast";

export const useStudentStats = (userId: string | undefined) => {
  const { toast } = useToast();

  const { data: studyStats } = useQuery({
    queryKey: ['studyStats', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Buscando estatísticas do estudante:", userId);
      
      const { data, error } = await supabase
        .rpc('get_study_stats', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível carregar suas estatísticas de estudo.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Estatísticas encontradas:", data);
      return data[0] as StudyStats;
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: {
      total_study_time: '0 minutes',
      consecutive_study_days: 0,
      weekly_study_hours: 0,
      weekly_questions_target: 250,
      weekly_questions_completed: 0
    }
  });

  const { data: syllabusProgress } = useQuery({
    queryKey: ['syllabusProgress', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Buscando progresso do edital:", userId);
      
      const { data, error } = await supabase
        .rpc('get_syllabus_progress', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar progresso:', error);
        toast({
          title: "Erro ao carregar progresso",
          description: "Não foi possível carregar seu progresso no edital.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Progresso encontrado:", data);
      return data[0] as SyllabusProgress;
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: {
      completed_topics: 0,
      pending_topics: 0,
      progress_percentage: 0
    }
  });

  const { data: weeklyStudyData } = useQuery({
    queryKey: ['weeklyStudyData', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Buscando dados semanais:", userId);
      
      const { data, error } = await supabase
        .rpc('get_weekly_study_data', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar dados semanais:', error);
        toast({
          title: "Erro ao carregar dados semanais",
          description: "Não foi possível carregar seus dados de estudo da semana.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Dados semanais encontrados:", data);
      return data as WeeklyStudyData[];
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: []
  });

  return {
    studyStats,
    syllabusProgress,
    weeklyStudyData,
  };
};