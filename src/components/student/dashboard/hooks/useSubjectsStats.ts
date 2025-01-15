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
          .eq('is_from_previous_exam', false);

        if (error) {
          console.error('Error fetching subjects:', error);
          throw error;
        }

        console.log('Raw questions data:', data);

        // Process the data
        const subjectCounts: Record<string, number> = {};
        data.forEach(question => {
          const subject = question.subject;
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });

        console.log('Processed subject counts:', subjectCounts);

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

        const result = Object.values(groups).sort((a, b) => b.totalQuestions - a.totalQuestions);
        console.log('Final grouped statistics:', result);
        return result;
      } catch (error) {
        console.error('Error in useSubjectsStats:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // 30 seconds - garante atualização automática
  });
};