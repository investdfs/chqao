import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudyStats, SyllabusProgress, WeeklyStudyData } from "@/types/database/functions";

const PREVIEW_STUDY_STATS: StudyStats = {
  total_study_time: '2 hours',
  consecutive_study_days: 3,
  weekly_study_hours: 8,
  weekly_questions_target: 250,
  weekly_questions_completed: 75
};

const PREVIEW_SYLLABUS_PROGRESS: SyllabusProgress = {
  completed_topics: 5,
  pending_topics: 15,
  progress_percentage: 25.0
};

const PREVIEW_WEEKLY_DATA: WeeklyStudyData[] = [
  { study_day: 'Mon', question_count: 25, study_time: '2 hours' },
  { study_day: 'Tue', question_count: 30, study_time: '2.5 hours' },
  { study_day: 'Wed', question_count: 20, study_time: '1.5 hours' }
];

export const useStudentStats = (userId: string | undefined) => {
  const isPreviewMode = !userId || userId === 'preview-user-id';

  const { data: studyStats } = useQuery({
    queryKey: ['studyStats', userId],
    queryFn: async () => {
      if (isPreviewMode) {
        console.log("Modo preview, retornando dados de exemplo");
        return PREVIEW_STUDY_STATS;
      }
      
      console.log("Buscando estatísticas do estudante:", userId);
      
      const { data, error } = await supabase
        .rpc('get_study_stats', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return PREVIEW_STUDY_STATS;
      }

      console.log("Estatísticas encontradas:", data);
      return data[0] as StudyStats;
    },
    enabled: true
  });

  const { data: syllabusProgress } = useQuery({
    queryKey: ['syllabusProgress', userId],
    queryFn: async () => {
      if (isPreviewMode) {
        console.log("Modo preview, retornando progresso de exemplo");
        return PREVIEW_SYLLABUS_PROGRESS;
      }
      
      console.log("Buscando progresso do edital:", userId);
      
      const { data, error } = await supabase
        .rpc('get_syllabus_progress', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar progresso:', error);
        return PREVIEW_SYLLABUS_PROGRESS;
      }

      console.log("Progresso encontrado:", data);
      return data[0] as SyllabusProgress;
    },
    enabled: true
  });

  const { data: weeklyStudyData } = useQuery({
    queryKey: ['weeklyStudyData', userId],
    queryFn: async () => {
      if (isPreviewMode) {
        console.log("Modo preview, retornando dados semanais de exemplo");
        return PREVIEW_WEEKLY_DATA;
      }
      
      console.log("Buscando dados semanais:", userId);
      
      const { data, error } = await supabase
        .rpc('get_weekly_study_data', {
          student_id_param: userId
        });

      if (error) {
        console.error('Erro ao buscar dados semanais:', error);
        return PREVIEW_WEEKLY_DATA;
      }

      console.log("Dados semanais encontrados:", data);
      return data as WeeklyStudyData[];
    },
    enabled: true
  });

  return {
    studyStats,
    syllabusProgress,
    weeklyStudyData,
  };
};