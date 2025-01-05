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
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
    image_url?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  studentId?: string;
  isUserBlocked?: boolean;
  showQuestionId?: boolean;
}

const QuestionCard = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  studentId,
  isUserBlocked = false,
  showQuestionId = false,
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
    
    setSessionStats(prev => {
      const isCorrect = selectedAnswer === question.correct_answer;
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
      showQuestionId={showQuestionId}
    />
  );
};

export default QuestionCard;