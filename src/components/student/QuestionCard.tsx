import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuestionHeader from "./question/QuestionHeader";
import QuestionMetadata from "./question/QuestionMetadata";
import QuestionOptions from "./question/QuestionOptions";
import QuestionFeedback from "./question/QuestionFeedback";
import NavigationButtons from "./question/NavigationButtons";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: QuestionOption[];
    correctAnswer: string;
    explanation: string;
    source?: string;
    subject?: string;
    topic?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
  studentId?: string;
}

const QuestionCard = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
  studentId,
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { toast } = useToast();

  // Reset states when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setHasAnswered(false);
  }, [question.id]);

  if (isUserBlocked) {
    return (
      <Card className="animate-fade-in dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-6 text-center">
            <div className="text-lg font-medium text-red-600 dark:text-red-400">
              Usuário bloqueado
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Entre em contato com o administrador para mais informações
            </p>
            <Button
              className="w-full sm:w-auto"
              onClick={() => window.open("https://wa.me/5532988847713", "_blank")}
            >
              Contatar Administrador
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAnswer = async () => {
    if (selectedAnswer && studentId) {
      setHasAnswered(true);
      
      try {
        console.log("Salvando resposta do usuário:", {
          questionId: question.id,
          selectedAnswer,
          studentId
        });
        
        const { error } = await supabase
          .from('question_answers')
          .upsert({
            question_id: question.id,
            selected_option: selectedAnswer,
            student_id: studentId
          }, {
            onConflict: 'question_id,student_id'
          });

        if (error) {
          console.error("Erro ao salvar resposta:", error);
          toast({
            title: "Erro ao salvar resposta",
            description: "Não foi possível salvar sua resposta. Tente novamente.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao salvar resposta:", error);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswer("");
    setHasAnswered(false);
  };

  return (
    <div className="space-y-6">
      <QuestionHeader
        isFocusMode={isFocusMode}
        onFocusModeToggle={() => setIsFocusMode(!isFocusMode)}
      />

      <Card className="animate-fade-in dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            <QuestionMetadata
              id={question.id}
              subject={question.subject}
              topic={question.topic}
              source={question.source}
            />

            <div className="text-base dark:text-gray-200 text-left">
              {question.text}
            </div>

            <QuestionOptions
              options={question.options}
              selectedAnswer={selectedAnswer}
              hasAnswered={hasAnswered}
              correctAnswer={question.correctAnswer}
              onAnswerSelect={setSelectedAnswer}
              questionId={question.id.toString()}
            />

            <NavigationButtons
              onPrevious={onPreviousQuestion}
              onNext={onNextQuestion}
              onAnswer={handleAnswer}
              canAnswer={!!selectedAnswer}
              hasAnswered={hasAnswered}
            />

            {hasAnswered && (
              <QuestionFeedback
                isCorrect={selectedAnswer === question.correctAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={question.correctAnswer}
                explanation={question.explanation}
                onReset={handleReset}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;