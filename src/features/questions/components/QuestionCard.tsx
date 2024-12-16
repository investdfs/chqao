import { useEffect, memo } from "react";
import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer";
import { FormattedQuestion } from "@/types/questions/common";

interface QuestionCardProps {
  question: FormattedQuestion;
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
  showQuestionId = true,
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

  return (
    <div className="space-y-6">
      <QuestionHeader
        isFocusMode={false}
        onFocusModeToggle={() => {}}
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
        showQuestionId={showQuestionId}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;