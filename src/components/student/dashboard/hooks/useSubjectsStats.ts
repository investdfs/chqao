import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubjectCount {
  subject: string;
  questionCount: number;
}

interface SubjectGroup {
  name: string;
  totalQuestions: number;
  subjects: SubjectCount[];
}

export const useSubjectsStats = () => {
  return useQuery({
    queryKey: ['subjects-stats'],
    queryFn: async () => {
      console.log('Fetching subjects statistics...');
      
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('subject')
          .eq('status', 'active')
          .throwOnError();

        if (error) {
          console.error('Error fetching subjects:', error);
          throw error;
        }

        // Process the data
        const subjectCounts: Record<string, number> = {};
        data.forEach(question => {
          const subject = question.subject;
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });

        // Group subjects
        const groups: Record<string, SubjectGroup> = {};
        Object.entries(subjectCounts).forEach(([subject, count]) => {
          const groupName = subject.split(' - ')[0];
          if (!groups[groupName]) {
            groups[groupName] = {
              name: groupName,
              totalQuestions: 0,
              subjects: []
            };
          }
          groups[groupName].subjects.push({
            subject,
            questionCount: count
          });
          groups[groupName].totalQuestions += count;
        });

        return Object.values(groups).sort((a, b) => b.totalQuestions - a.totalQuestions);
      } catch (error) {
        console.error('Error in useSubjectsStats:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // 30 seconds
  });
};