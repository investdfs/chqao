import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type SubjectStats = {
  subject: string;
  theme: string | null;
  topic: string | null;
  count: number;
};

type SubjectGroup = {
  name: string;
  totalQuestions: number;
  subjects: {
    subject: string;
    questionCount: number;
  }[];
};

export const useSubjectsStats = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["subjects-stats"],
    queryFn: async () => {
      console.log("Fetching subjects statistics...");
      
      try {
        const { data: stats, error } = await supabase
          .rpc('get_subjects_count')
          .throwOnError();

        if (error) {
          console.error("Error fetching subjects stats:", error);
          toast({
            title: "Erro ao carregar estatísticas",
            description: "Tentando novamente em alguns segundos...",
            variant: "destructive"
          });
          throw error;
        }

        console.log("Raw stats data:", stats);

        // Predefined subject structure
        const subjectGroups: SubjectGroup[] = [
          {
            name: "Conhecimentos Gerais (CHQAO e CHQAO Mus)",
            totalQuestions: 0,
            subjects: [
              { subject: "Língua Portuguesa", questionCount: 0 },
              { subject: "Geografia do Brasil", questionCount: 0 },
              { subject: "História do Brasil", questionCount: 0 },
            ],
          },
          {
            name: "Conhecimentos Profissionais (CHQAO)",
            totalQuestions: 0,
            subjects: [
              { subject: "E-1 - Estatuto dos Militares", questionCount: 0 },
              { subject: "Licitações e Contratos", questionCount: 0 },
              { subject: "Regulamento de Administração do Exército (RAE)", questionCount: 0 },
              { subject: "Direito Militar e Sindicância", questionCount: 0 },
              { subject: "Código Penal Militar", questionCount: 0 },
              { subject: "Código de Processo Penal Militar", questionCount: 0 },
              { subject: "Sindicância", questionCount: 0 },
            ],
          },
          {
            name: "Conhecimentos Profissionais (CHQAO Mus)",
            totalQuestions: 0,
            subjects: [
              { subject: "Conhecimentos Musicais Gerais", questionCount: 0 },
              { subject: "Harmonia Elementar (vocal) e Funcional (instrumental)", questionCount: 0 },
              { subject: "Períodos da História da Música", questionCount: 0 },
              { subject: "Instrumentação", questionCount: 0 },
              { subject: "Canto Modulante", questionCount: 0 },
              { subject: "Transcrição", questionCount: 0 },
            ],
          },
        ];

        // Update question counts from database stats
        stats?.forEach((stat: { subject: string; count: number }) => {
          for (const group of subjectGroups) {
            const subject = group.subjects.find(s => s.subject === stat.subject);
            if (subject) {
              subject.questionCount = Number(stat.count);
              group.totalQuestions += Number(stat.count);
              break;
            }
          }
        });

        console.log("Processed subject groups:", subjectGroups);
        return subjectGroups;
      } catch (error) {
        console.error("Error in useSubjectsStats:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 30000, // Reduzido para 30 segundos
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};