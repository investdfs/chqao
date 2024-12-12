import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuestionsStatsData {
  totalQuestions: number;
  previousExams: {
    total: number;
    questions: number;
  };
}

export const useQuestionsStats = () => {
  const [stats, setStats] = useState<QuestionsStatsData>({
    totalQuestions: 0,
    previousExams: {
      total: 0,
      questions: 0
    }
  });

  const fetchStats = async () => {
    try {
      console.log('Fetching questions statistics...');
      
      // Fetch total regular questions
      const { count: regularQuestionsCount, error: regularError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (regularError) {
        console.error('Error fetching regular questions:', regularError);
        return;
      }

      // Fetch previous exam questions count
      const { count: examQuestionsCount, error: examError } = await supabase
        .from('previous_exam_questions')
        .select('*', { count: 'exact', head: true });

      if (examError) {
        console.error('Error fetching exam questions:', examError);
        return;
      }

      // Fetch previous exams statistics
      const { data: examStats, error: examStatsError } = await supabase
        .from('previous_exams')
        .select(`
          id,
          year,
          previous_exam_questions (
            count
          )
        `);

      if (examStatsError) {
        console.error('Error fetching exam stats:', examStatsError);
        return;
      }

      const totalExams = examStats?.length || 0;

      setStats({
        totalQuestions: (regularQuestionsCount || 0) + (examQuestionsCount || 0),
        previousExams: {
          total: totalExams,
          questions: examQuestionsCount || 0
        }
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return {
    stats,
    fetchStats
  };
};