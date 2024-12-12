import React from "react";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/features/questions/hooks/useQuestionAnswer";

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
    exam_year?: number;
    is_from_previous_exam?: boolean;
    exam_question_number?: number;
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
  console.log("Renderizando QuestionCard para questão:", question);

  const {
    selectedAnswer,
    isAnswered,
    isCorrect,
    handleOptionSelect,
    showExplanation,
  } = useQuestionAnswer(question.id, question.correct_answer, studentId);

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
    <QuestionContent
      question={question}
      selectedAnswer={selectedAnswer}
      isAnswered={isAnswered}
      isCorrect={isCorrect}
      onOptionSelect={handleOptionSelect}
      showExplanation={showExplanation}
      onNextQuestion={onNextQuestion}
      onPreviousQuestion={onPreviousQuestion}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
    />
  );
};

export default QuestionCard;