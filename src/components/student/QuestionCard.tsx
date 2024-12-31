import { useEffect, memo } from "react";
import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";
import { useQuestion } from "@/contexts/QuestionContext";

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
  studentId?: string;
}

const QuestionCard = memo(({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
  studentId,
}: QuestionCardProps) => {
  console.log("Renderizando QuestionCard para questão:", question.id);

  // Recupera as estatísticas do localStorage ou usa valores iniciais
  const getStoredStats = () => {
    const stored = localStorage.getItem('sessionStats');
    return stored ? JSON.parse(stored) : {
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    };
  };

  const updateStoredStats = (isCorrect: boolean) => {
    const currentStats = getStoredStats();
    const newStats = {
      totalQuestions: currentStats.totalQuestions + 1,
      correctAnswers: currentStats.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: currentStats.wrongAnswers + (isCorrect ? 0 : 1)
    };
    localStorage.setItem('sessionStats', JSON.stringify(newStats));
    return newStats;
  };

  const {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset
  } = useQuestionAnswer({
    questionId: question.id,
    studentId
  });

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
  }, [question.id]);

  useEffect(() => {
    if (hasAnswered) {
      const isCorrect = selectedAnswer === question.correctAnswer;
      updateStoredStats(isCorrect);
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
        sessionStats={getStoredStats()}
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
        studentId={studentId}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;