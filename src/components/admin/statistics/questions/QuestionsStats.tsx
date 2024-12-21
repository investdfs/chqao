import { useState, useCallback } from "react";
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

  const fetchStats = useCallback(async () => {
    try {
      console.log('Fetching questions statistics...');
      
      // Fetch total regular questions (only active)
      const { count: regularQuestionsCount, error: regularError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (regularError) {
        console.error('Error fetching regular questions:', regularError);
        throw regularError;
      }

      // First get previous exams count
      const { data: exams, error: examsError } = await supabase
        .from('previous_exams')
        .select('id');

      if (examsError) {
        console.error('Error fetching exams:', examsError);
        throw examsError;
      }

      const totalExams = exams?.length || 0;
      console.log(`Found ${totalExams} previous exams`);

      // Then get exam questions count if there are any exams
      let examQuestionsCount = 0;
      if (totalExams > 0) {
        const examIds = exams.map(exam => exam.id);
        const { count, error: questionsError } = await supabase
          .from('previous_exam_questions')
          .select('*', { count: 'exact', head: true })
          .in('exam_id', examIds);

        if (questionsError) {
          console.error('Error fetching exam questions:', questionsError);
          throw questionsError;
        }

        examQuestionsCount = count || 0;
        console.log(`Found ${examQuestionsCount} exam questions`);
      }

      const newStats = {
        totalQuestions: (regularQuestionsCount || 0) + examQuestionsCount,
        previousExams: {
          total: totalExams,
          questions: examQuestionsCount
        }
      };

      console.log('Statistics updated:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep the previous stats in case of error
      setStats(prev => prev);
    }
  }, []);

  return {
    stats,
    fetchStats
  };
};
