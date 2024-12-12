import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider, useQuestion } from "@/features/questions/contexts/QuestionContext";

const isPreviewMode = window.location.hostname === 'preview.lovable.dev';

// Mock student data for preview mode
const previewStudentData = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'preview@example.com',
  name: 'Preview User',
  status: 'active'
};

const PreviousExamsContent = () => {
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

  if (isLoadingStudent && !isPreviewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg bg-gray-800/50" />
        </div>
      </div>
    );
  }

  // In preview mode, we'll use mock data instead of requiring authentication
  const effectiveStudentData = isPreviewMode ? previewStudentData : studentData;

  if (!effectiveStudentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Acesso não autorizado
          </h2>
          <p className="mt-2 text-gray-400">
            Faça login como estudante para acessar as questões
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Erro ao carregar questões
          </h2>
          <p className="mt-2 text-gray-400">
            Tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Nenhuma questão disponível
          </h2>
          <p className="mt-2 text-gray-400">
            Aguarde até que novas questões sejam adicionadas
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          question={currentQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          studentId={effectiveStudentData.id}
          isUserBlocked={effectiveStudentData.status === 'blocked'}
        />
      </div>
    </div>
  );
};

const PreviousExams = () => {
  return (
    <QuestionProvider>
      <PreviousExamsContent />
    </QuestionProvider>
  );
};

export default PreviousExams;