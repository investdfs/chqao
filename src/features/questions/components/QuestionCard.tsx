import React from "react";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
    source?: string;
    subject?: string;
    topic?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  studentId: string;
  isUserBlocked?: boolean;
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
  console.log("Renderizando QuestionCard para questão:", question.id);

  const {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer,
    handleReset
  } = useQuestionAnswer({ questionId: question.id, studentId });

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
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
  );
};

export default QuestionCard;