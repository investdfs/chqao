import { useEffect, memo, useState } from "react";
import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: {
    id: string;
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
}

const QuestionCard = memo(({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
}: QuestionCardProps) => {
  console.log("Renderizando QuestionCard para questão:", question.id);

  // Este estado é apenas para o contador local da sessão
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  });

  const {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset
  } = useQuestionAnswer({
    questionId: question.id
  });

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
  }, [question.id]);

  // Atualiza apenas as estatísticas locais da sessão
  useEffect(() => {
    if (hasAnswered) {
      setSessionStats(prev => ({
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (selectedAnswer === question.correctAnswer ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (selectedAnswer !== question.correctAnswer ? 1 : 0)
      }));
    }
  }, [hasAnswered, selectedAnswer, question.correctAnswer]);

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
    <div className="space-y-6">
      <QuestionHeader
        isFocusMode={false}
        onFocusModeToggle={() => {}}
        sessionStats={sessionStats}
      />
      <QuestionContent
        question={question}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        hasAnswered={hasAnswered}
        handleAnswer={handleAnswer}
        handleReset={handleReset}
        onNextQuestion={onNextQuestion}
        onPreviousQuestion={onPreviousQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;