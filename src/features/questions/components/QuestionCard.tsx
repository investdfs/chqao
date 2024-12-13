import { useEffect, memo } from "react";
import QuestionHeader from "./question/QuestionHeader";
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
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
  studentId?: string;
  showQuestionId?: boolean;
}

const QuestionCard = memo(({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
  studentId,
  showQuestionId = false,
}: QuestionCardProps) => {
  console.log("Renderizando QuestionCard para questão:", question);

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

  return (
    <div className="h-full flex flex-col space-y-4">
      <QuestionHeader />
      <div className="flex-1 overflow-y-auto">
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
          showQuestionId={showQuestionId}
        />
      </div>
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;