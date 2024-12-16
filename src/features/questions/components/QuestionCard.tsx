import { useEffect, memo } from "react";
import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "@/components/student/question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestionAnswer } from "../hooks/useQuestionAnswer";
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

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
  }, [question.id]);

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  // Transform question data to match expected format
  const transformedQuestion = {
    ...question,
    options: [
      { id: "A", text: question.option_a },
      { id: "B", text: question.option_b },
      { id: "C", text: question.option_c },
      { id: "D", text: question.option_d },
      { id: "E", text: question.option_e },
    ],
    correctAnswer: question.correct_answer
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <QuestionHeader 
        isFocusMode={false}
        onFocusModeToggle={() => {}}
      />
      
      <div className="flex-1 overflow-y-auto">
        <QuestionContent
          question={transformedQuestion}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          hasAnswered={!isExamMode && hasAnswered}
          handleAnswer={handleAnswer}
          handleReset={handleReset}
          onNextQuestion={onNextQuestion}
          onPreviousQuestion={onPreviousQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </div>

      <ExamCompletionDialog
        open={false}
        onOpenChange={() => {}}
        questions={questions}
        answers={examAnswers}
        startTime={examStartTime!}
        onFinish={() => {
          resetExamMode();
        }}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;