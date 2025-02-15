
import { useEffect, memo, useState } from "react";
import QuestionHeader from "./QuestionHeader";
import QuestionContent from "./QuestionContent";
import BlockedUserCard from "./BlockedUserCard";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";

interface QuestionData {
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
}

interface QuestionCardProps {
  question: QuestionData;
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
  console.log("Renderizando QuestionCard:", {
    questionNumber,
    totalQuestions,
    questionId: question.id
  });

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
    handleReset
  } = useQuestionAnswer({
    questionId: question.id,
    studentId
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

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
    setSelectedAnswer('');
  }, [question.id]);

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  const formattedOptions = [
    { id: 'a', text: question.option_a },
    { id: 'b', text: question.option_b },
    { id: 'c', text: question.option_c },
    { id: 'd', text: question.option_d },
    { id: 'e', text: question.option_e }
  ];

  const formattedQuestion = {
    id: question.id,
    text: question.text,
    subject: question.subject,
    topic: question.topic,
    source: question.source,
    options: formattedOptions,
    correctAnswer: question.correct_answer,
    explanation: question.explanation,
    image_url: question.image_url
  };

  return (
    <div className="space-y-6">
      <QuestionHeader
        isFocusMode={false}
        onFocusModeToggle={() => {}}
      />
      <QuestionContent
        question={formattedQuestion}
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
