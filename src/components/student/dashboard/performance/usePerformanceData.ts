import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StudyRecommendation {
  subject: string;
  currentHours: number;
  recommendedHours: number;
  questionsPerDay: number;
  status: 'danger' | 'warning' | 'success';
}

const PREVIEW_DATA: StudyRecommendation[] = [
  {
    subject: "História do Brasil",
    currentHours: 2,
    recommendedHours: 6,
    questionsPerDay: 20,
    status: 'warning'
  },
  {
    subject: "Geografia do Brasil",
    currentHours: 1,
    recommendedHours: 4,
    questionsPerDay: 15,
    status: 'danger'
  },
  {
    subject: "Direito Militar",
    currentHours: 5,
    recommendedHours: 4,
    questionsPerDay: 10,
    status: 'success'
  }
];

export const usePerformanceData = (userId?: string) => {
  const isPreviewMode = !userId || userId === 'preview-user-id';

  return useQuery({
    queryKey: ['study-recommendations', userId],
    queryFn: async () => {
      if (isPreviewMode) {
        console.log("Usando dados de preview para recomendações");
        return PREVIEW_DATA;
      }

      console.log("Buscando recomendações de estudo para usuário:", userId);

      try {
        // Buscar dados de desempenho atual do aluno
        const { data: performance, error: perfError } = await supabase
          .from('question_answers')
          .select(`
            questions!inner (
              subject,
              correct_answer
            ),
            selected_option
          `)
          .eq('student_id', userId);

        if (perfError) {
          console.error('Erro ao buscar desempenho:', perfError);
          return [];
        }

        // Agrupar por matéria e calcular aproveitamento
        const subjectPerformance = performance.reduce((acc: Record<string, { total: number; correct: number }>, answer) => {
          const subject = answer.questions.subject;
          if (!acc[subject]) {
            acc[subject] = { total: 0, correct: 0 };
          }
          acc[subject].total++;
          if (answer.selected_option === answer.questions.correct_answer) {
            acc[subject].correct++;
          }
          return acc;
        }, {});

        // Calcular recomendações
        const recommendations: StudyRecommendation[] = Object.entries(subjectPerformance).map(([subject, stats]) => {
          const currentPercentage = (stats.correct / stats.total) * 100;
          const recommendedHours = calculateRecommendedHours(currentPercentage);
          const currentHours = stats.total * 0.25; // Estimativa de 15min por questão
          const questionsPerDay = Math.ceil((recommendedHours * 60) / 15); // 15min por questão

          return {
            subject,
            currentHours: Number(currentHours.toFixed(1)),
            recommendedHours: Number(recommendedHours.toFixed(1)),
            questionsPerDay,
            status: getStudyStatus(currentHours, recommendedHours)
          };
        });

        console.log("Recomendações calculadas:", recommendations);
        return recommendations;
      } catch (error) {
        console.error('Erro ao processar dados:', error);
        return [];
      }
    },
    enabled: true // Sempre habilitado para mostrar pelo menos dados de preview
  });
};

function calculateRecommendedHours(currentPercentage: number): number {
  if (currentPercentage >= 90) return 2; // Manutenção
  if (currentPercentage >= 70) return 4; // Reforço moderado
  return 6; // Foco intensivo
}

function getStudyStatus(current: number, recommended: number): 'danger' | 'warning' | 'success' {
  const ratio = current / recommended;
  if (ratio < 0.5) return 'danger';
  if (ratio < 0.8) return 'warning';
  return 'success';
}