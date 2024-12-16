import { useEffect, memo, useState } from "react";
import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "@/features/questions/hooks/useQuestionAnswer";
import { useExamMode } from "../contexts/ExamModeContext";
import { ExamCompletionDialog } from "./exam/ExamCompletionDialog";

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
    image_url?: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
  studentId?: string;
  showQuestionId?: boolean;
  questions?: any[];
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
  questions = [],
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

  const {
    isExamMode,
    examStartTime,
    examAnswers,
    addAnswer,
    resetExamMode
  } = useExamMode();

  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
  }, [question.id]);

  const handleExamAnswer = () => {
    if (isExamMode && selectedAnswer) {
      addAnswer(question.id, selectedAnswer);
      if (questionNumber === totalQuestions) {
        setShowCompletionDialog(true);
      } else {
        onNextQuestion();
      }
    } else {
      handleAnswer();
    }
  };

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <QuestionHeader 
        isFocusMode={isFocusMode}
        onFocusModeToggle={() => setIsFocusMode(!isFocusMode)}
      />
      
      <div className="flex-1 overflow-y-auto">
        <QuestionContent
          question={question}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          hasAnswered={!isExamMode && hasAnswered}
          handleAnswer={handleExamAnswer}
          handleReset={handleReset}
          onNextQuestion={onNextQuestion}
          onPreviousQuestion={onPreviousQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          showQuestionId={showQuestionId}
        />
      </div>

      <ExamCompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        questions={questions}
        answers={examAnswers}
        startTime={examStartTime!}
        onFinish={() => {
          setShowCompletionDialog(false);
          resetExamMode();
        }}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;