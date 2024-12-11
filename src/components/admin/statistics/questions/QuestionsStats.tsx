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
      
      // Fetch total questions
      const { count: questionsCount, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return;
      }

      // Fetch previous exams statistics
      const { data: examStats, error: examError } = await supabase
        .from('previous_exams')
        .select(`
          id,
          year,
          previous_exam_questions (
            count
          )
        `);

      if (examError) {
        console.error('Error fetching exam stats:', examError);
        return;
      }

      const totalExams = examStats?.length || 0;
      const totalExamQuestions = examStats?.reduce((sum, exam) => 
        sum + (exam.previous_exam_questions?.[0]?.count || 0), 0
      );

      setStats({
        totalQuestions: questionsCount || 0,
        previousExams: {
          total: totalExams,
          questions: totalExamQuestions
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