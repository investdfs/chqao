import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuestionStats {
  totalQuestions: number;
  previousExams: {
    total: number;
    questions: number;
  };
}

export const useQuestionsStats = () => {
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    previousExams: {
      total: 0,
      questions: 0
    }
  });

  const fetchStats = async () => {
    try {
      console.log('Fetching questions stats...');
      
      // Get total active questions
      const { count: totalQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (questionsError) throw questionsError;

      // Get previous exams stats
      const { data: examsData, error: examsError } = await supabase
        .from('previous_exams')
        .select(`
          id,
          previous_exam_questions (count)
        `);

      if (examsError) throw examsError;

      const totalExams = examsData?.length || 0;
      const totalExamQuestions = examsData?.reduce((acc, exam) => 
        acc + (exam.previous_exam_questions?.length || 0), 0) || 0;

      const newStats = {
        totalQuestions: totalQuestions || 0,
        previousExams: {
          total: totalExams,
          questions: totalExamQuestions
        }
      };

      console.log('Statistics updated:', newStats);
      setStats(newStats);
      
      return newStats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  };

  return {
    stats,
    fetchStats
  };
};