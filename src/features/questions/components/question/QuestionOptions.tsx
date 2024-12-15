import { RadioGroup } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAutoAnswer } from "@/features/questions/hooks/useAutoAnswer";
import { OptionItem } from "@/components/student/question/options/OptionItem";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionOptionsProps {
  options: QuestionOption[];
  selectedAnswer: string;
  hasAnswered: boolean;
  correctAnswer: string;
  onAnswerSelect: (value: string) => void;
  questionId: string;
  onAutoAnswer?: () => void;
}

const QuestionOptions = ({
  options = [],
  selectedAnswer,
  hasAnswered,
  correctAnswer,
  onAnswerSelect,
  questionId,
  onAutoAnswer,
}: QuestionOptionsProps) => {
  console.log("Rendering QuestionOptions with options:", options);
  const { isAutoAnswerEnabled } = useAutoAnswer();
  
  const { data: answerCounts } = useQuery({
    queryKey: ['answer-counts', questionId],
    queryFn: async () => {
      console.log("Buscando contagem de respostas para questão:", questionId);
      const { data, error } = await supabase
        .rpc('get_answer_counts', { question_id: questionId });
      
      if (error) {
        console.error("Erro ao buscar contagem de respostas:", error);
        return {};
      }

      const counts: Record<string, number> = {};
      data?.forEach(item => {
        counts[item.option_letter] = Number(item.count);
      });
      
      console.log("Contagem de respostas:", counts);
      return counts;
    },
    enabled: hasAnswered,
  });

  const handleOptionSelect = (value: string) => {
    onAnswerSelect(value);
    if (isAutoAnswerEnabled && onAutoAnswer) {
      console.log("Auto-resposta ativada, respondendo automaticamente");
      onAutoAnswer();
    }
  };

  if (!Array.isArray(options) || options.length === 0) {
    console.warn("No options provided to QuestionOptions component");
    return null;
  }

  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={handleOptionSelect}
      disabled={hasAnswered}
      className="space-y-3"
    >
      {options.map((option) => (
        <OptionItem
          key={option.id}
          id={option.id}
          text={option.text}
          isSelected={selectedAnswer === option.id}
          isCorrect={option.id === correctAnswer}
          hasAnswered={hasAnswered}
          answerCount={answerCounts?.[option.id]}
        />
      ))}
    </RadioGroup>
  );
};

export default QuestionOptions;