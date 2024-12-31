import { useState } from 'react';
import QuestionContent from "@/components/student/question/QuestionContent";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";
import BlockedUserCard from "./question/BlockedUserCard";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    subject?: string;
    topic?: string;
    source?: string;
    options: Array<{ id: string; text: string }>;
    correctAnswer: string;
    explanation: string;
    image_url?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  studentId?: string;
  isUserBlocked?: boolean;
}

const QuestionCard = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  studentId,
  isUserBlocked = false,
}: QuestionCardProps) => {
  const [sessionStats, setSessionStats] = useState({
    totalAnswered: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  });

  const {
    selectedAnswer,
    setSelectedAnswer,
    hasAnswered,
    handleAnswer: originalHandleAnswer,
    handleReset,
  } = useQuestionAnswer({
    questionId: question.id,
    studentId,
  });

  const handleAnswer = async () => {
    await originalHandleAnswer();
    
    // Update session stats after answering
    setSessionStats(prev => {
      const isCorrect = selectedAnswer === question.correctAnswer;
      return {
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1)
      };
    });
  };

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
      studentId={studentId}
      sessionStats={sessionStats}
    />
  );
};

export default QuestionCard;