import { useEffect, memo } from "react";
import QuestionHeader from "./question/QuestionHeader";
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
    secondary_id?: string;
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

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  // Transform the question format to match what QuestionContent expects
  const formattedQuestion = {
    id: question.id,
    text: question.text,
    subject: question.subject,
    topic: question.topic,
    source: question.source,
    options: [
      { id: 'A', text: question.option_a },
      { id: 'B', text: question.option_b },
      { id: 'C', text: question.option_c },
      { id: 'D', text: question.option_d },
      { id: 'E', text: question.option_e },
    ],
    correctAnswer: question.correct_answer,
    explanation: question.explanation,
    secondaryId: question.secondary_id
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