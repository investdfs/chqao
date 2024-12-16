import { Check, X, Users } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAutoAnswer } from "@/features/questions/hooks/useAutoAnswer";

interface QuestionOption {
  id: string;
  text: string;
}

interface EnhancedQuestionOptionsProps {
  options: QuestionOption[];
  selectedAnswer: string;
  hasAnswered: boolean;
  correctAnswer: string;
  onAnswerSelect: (value: string) => void;
  questionId: string;
  onAutoAnswer?: () => void;
}

const EnhancedQuestionOptions = ({
  options = [], // Fornece um array vazio como fallback
  selectedAnswer,
  hasAnswered,
  correctAnswer,
  onAnswerSelect,
  questionId,
  onAutoAnswer,
}: EnhancedQuestionOptionsProps) => {
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

  // Verifica se options existe e é um array antes de tentar fazer o map
  if (!Array.isArray(options) || options.length === 0) {
    console.warn("Nenhuma opção fornecida para o componente EnhancedQuestionOptions");
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
        <label
          key={option.id}
          className={`block cursor-pointer transition-all ${
            hasAnswered ? 'cursor-default' : 'hover:scale-[1.01]'
          }`}
        >
          <div
            className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${
              !hasAnswered
                ? "hover:border-primary hover:bg-primary-light dark:hover:bg-blue-900/30 dark:hover:border-blue-600 border-gray-200 dark:border-gray-700"
                : option.id === correctAnswer
                ? "border-success bg-success-light dark:bg-blue-900/30 dark:border-blue-600"
                : option.id === selectedAnswer
                ? "border-error bg-error-light dark:bg-red-900/30 dark:border-red-600"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => handleOptionSelect(option.id)}
              disabled={hasAnswered}
            />
            <span className="flex-1 text-sm dark:text-gray-200">
              {option.text}
            </span>
            {hasAnswered && (
              <div className="flex items-center space-x-2">
                {answerCounts && answerCounts[option.id] > 0 && (
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {answerCounts[option.id]}
                  </span>
                )}
                {option.id === correctAnswer && (
                  <Check className="h-5 w-5 text-success dark:text-blue-400" />
                )}
                {option.id === selectedAnswer && option.id !== correctAnswer && (
                  <X className="h-5 w-5 text-error dark:text-red-400" />
                )}
              </div>
            )}
          </div>
        </label>
      ))}
    </RadioGroup>
  );
};

export default EnhancedQuestionOptions;