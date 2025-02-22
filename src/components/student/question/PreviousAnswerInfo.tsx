import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface PreviousAnswerInfoProps {
  questionId: string;
  studentId?: string;
}

const PreviousAnswerInfo = memo(({ questionId, studentId }: PreviousAnswerInfoProps) => {
  console.log("Renderizando PreviousAnswerInfo para questão:", questionId, "e estudante:", studentId);

  const { data: previousAnswer } = useQuery({
    queryKey: ['previousAnswer', questionId, studentId],
    queryFn: async () => {
      // Se não houver studentId ou for preview-user-id, não buscar dados
      if (!studentId || studentId === 'preview-user-id') {
        console.log("Modo preview - não buscando resposta anterior");
        return null;
      }

      console.log("Buscando resposta anterior para questão:", questionId);

      const { data, error } = await supabase
        .from('question_answers')
        .select(`
          *,
          questions!inner (
            correct_answer
          )
        `)
        .eq('question_id', questionId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar resposta anterior:', error);
        return null;
      }

      console.log("Resposta anterior encontrada:", data);
      return data;
    },
    enabled: !!questionId && !!studentId && studentId !== 'preview-user-id',
  });

  if (!previousAnswer) return null;

  const isCorrect = previousAnswer.selected_option === previousAnswer.questions.correct_answer;
  const answerDate = format(new Date(previousAnswer.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <div className={`p-4 rounded-lg ${
      isCorrect 
        ? 'bg-success-light text-success dark:bg-success/20 dark:text-success-light' 
        : 'bg-error-light text-error dark:bg-error/20 dark:text-error-light'
    }`}>
      <p className="text-sm">
        Você já respondeu esta questão em {answerDate}.
        Resultado: <span className="font-semibold">{isCorrect ? 'Acertou' : 'Errou'}</span>
      </p>
    </div>
  );
});

PreviousAnswerInfo.displayName = 'PreviousAnswerInfo';

export default PreviousAnswerInfo;