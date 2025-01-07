import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSessionPerformance = () => {
  const { toast } = useToast();

  const saveSessionPerformance = useCallback(async (
    correctAnswers: number,
    incorrectAnswers: number
  ) => {
    const total = correctAnswers + incorrectAnswers;
    const percentage = total > 0 ? (correctAnswers / total) * 100 : 0;

    const { error } = await supabase
      .from('study_sessions')
      .insert({
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        percentage,
        student_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error saving session performance:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar desempenho",
        description: "Não foi possível salvar o desempenho desta sessão."
      });
      return;
    }

    toast({
      title: "Sessão finalizada",
      description: "Seu desempenho foi registrado com sucesso!"
    });
  }, [toast]);

  return { saveSessionPerformance };
};