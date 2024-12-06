import { useEffect, memo } from "react";
import QuestionHeader from "@/features/questions/components/question/QuestionHeader";
import QuestionContent from "@/features/questions/components/question/QuestionContent";
import BlockedUserCard from "@/features/questions/components/question/BlockedUserCard";
import { useQuestionAnswer } from "@/features/questions/hooks/useQuestionAnswer";
import { useSessionStats } from "@/features/questions/hooks/useSessionStats";

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  subject?: string;
  topic?: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
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
  studentId
}: QuestionCardProps) => {
  console.log("Renderizando QuestionCard para questão:", question.id);

  const { selectedAnswer, setSelectedAnswer, hasAnswered, handleAnswer, handleReset } = useQuestionAnswer({
    questionId: question.id,
    studentId
  });

  const { sessionStats, updateStats, resetStats } = useSessionStats();

  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    handleReset();
  }, [question.id]);

  const handleAnswerWithStats = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    updateStats(selectedAnswer, isCorrect);
    handleAnswer();
  };

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
    <div className="space-y-6">
      <QuestionHeader />
      <QuestionContent
        question={question}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        hasAnswered={hasAnswered}
        handleAnswer={handleAnswerWithStats}
        handleReset={handleReset}
        onNextQuestion={onNextQuestion}
        onPreviousQuestion={onPreviousQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        sessionStats={sessionStats}
      />
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;