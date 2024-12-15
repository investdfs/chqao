import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider, useQuestion } from "@/features/questions/contexts/QuestionContext";
import { PreviewUser } from "@/types/user";

interface QuestionPracticeProps {
  previewUser?: PreviewUser;
}

const QuestionPracticeContent = () => {
  const {
    currentQuestionIndex,
    studentData,
    questions,
    isLoadingStudent,
    isLoadingQuestions,
    error,
    handleNextQuestion,
    handlePreviousQuestion,
    currentQuestion
  } = useQuestion();

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light p-4 flex items-center">
        <div className="max-w-4xl w-full mx-auto">
          <Skeleton className="h-[calc(100vh-2rem)] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center">
          <h2 className="text-2xl font-bold text-white">
            Erro ao carregar questões
          </h2>
          <p className="mt-2 text-white/80">
            Tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center">
          <h2 className="text-2xl font-bold text-white">
            Nenhuma questão disponível
          </h2>
          <p className="mt-2 text-white/80">
            Aguarde até que novas questões sejam adicionadas
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex flex-col">
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <QuestionCard
            question={currentQuestion}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            studentId={studentData?.id}
            isUserBlocked={studentData?.status === 'blocked'}
          />
        </div>
      </div>
    </div>
  );
};

const QuestionPractice = ({ previewUser }: QuestionPracticeProps) => {
  return (
    <QuestionProvider>
      <QuestionPracticeContent />
    </QuestionProvider>
  );
};

export default QuestionPractice;