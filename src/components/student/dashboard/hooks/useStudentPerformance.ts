import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudentPerformance } from "@/types/database/functions";

const PREVIEW_PERFORMANCE: StudentPerformance[] = [
  {
    subject: "História",
    questions_answered: 50,
    correct_answers: 35
  },
  {
    subject: "Geografia",
    questions_answered: 40,
    correct_answers: 30
  },
  {
    subject: "Direito",
    questions_answered: 30,
    correct_answers: 20
  }
];

export const useStudentPerformance = (userId: string | undefined) => {
  const isPreviewMode = !userId || userId === 'preview-user-id';

  const { data: performanceData } = useQuery({
    queryKey: ['studentPerformance', userId],
    queryFn: async () => {
      if (isPreviewMode) {
        console.log("Modo preview, retornando dados de exemplo");
        return PREVIEW_PERFORMANCE;
      }
      
      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: userId
        });

      if (error) {
        console.error('Error fetching performance:', error);
        return PREVIEW_PERFORMANCE;
      }

      return data as StudentPerformance[];
    },
    enabled: true
  });

  const subjects = performanceData?.map(subject => ({
    name: subject.subject,
    studyTime: "10h06min",
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