import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SubjectStats = {
  subject: string;
  questionCount: number;
};

type SubjectGroup = {
  name: string;
  totalQuestions: number;
  subjects: SubjectStats[];
};

export const useSubjectsStats = () => {
  return useQuery({
    queryKey: ["subjects-stats"],
    queryFn: async () => {
      const { data: questions, error } = await supabase
        .from("questions")
        .select("subject")
        .is("deleted_at", null);

      if (error) {
        console.error("Error fetching subjects stats:", error);
        throw error;
      }

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

      // Count questions for each subject
      questions?.forEach((question) => {
        for (const group of subjectGroups) {
          const subject = group.subjects.find(s => s.subject === question.subject);
          if (subject) {
            subject.questionCount++;
            group.totalQuestions++;
            break;
          }
        }
      });

      return subjectGroups;
    },
  });
};