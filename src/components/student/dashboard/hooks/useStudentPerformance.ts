import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudentPerformance } from "@/types/database/functions";

export const useStudentPerformance = (userId: string | undefined) => {
  const { data: performanceData } = useQuery({
    queryKey: ['studentPerformance', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching performance:', error);
        return null;
      }

      return data as StudentPerformance[];
    },
    enabled: !!userId,
  });

  const subjects = performanceData?.map(subject => ({
    name: subject.subject,
    studyTime: "10h06min", // This should come from the backend
    correctAnswers: Number(subject.correct_answers),
    incorrectAnswers: Number(subject.questions_answered - subject.correct_answers),
    totalQuestions: Number(subject.questions_answered),
    performance: (Number(subject.correct_answers) / Number(subject.questions_answered)) * 100 || 0,
  })) || [];

  const totalCorrect = subjects.reduce((sum, subject) => sum + subject.correctAnswers, 0);
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0);
  const performancePercentage = (totalCorrect / totalQuestions) * 100 || 0;

  return {
    subjects,
    totalCorrect,
    totalQuestions,
    performancePercentage,
  };
};