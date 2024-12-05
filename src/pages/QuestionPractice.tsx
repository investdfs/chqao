import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/components/student/QuestionCard";
import { useQuestionPractice } from "@/hooks/useQuestionPractice";

const QuestionPractice = () => {
  const {
    currentQuestionIndex,
    studentData,
    questions,
    isLoadingStudent,
    isLoadingQuestions,
    error,
    handleNextQuestion,
    handlePreviousQuestion
  } = useQuestionPractice();

  if (isLoadingStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Acesso não autorizado
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Faça login como estudante para acessar as questões
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Erro ao carregar questões
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Nenhuma questão disponível
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Aguarde até que novas questões sejam adicionadas
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const formattedQuestion = {
    id: currentQuestion.id,
    text: currentQuestion.text,
    subject: currentQuestion.subject,
    topic: currentQuestion.topic || undefined,
    options: [
      { id: "A", text: currentQuestion.option_a },
      { id: "B", text: currentQuestion.option_b },
      { id: "C", text: currentQuestion.option_c },
      { id: "D", text: currentQuestion.option_d },
      { id: "E", text: currentQuestion.option_e },
    ],
    correctAnswer: currentQuestion.correct_answer,
    explanation: currentQuestion.explanation || "",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          question={formattedQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          studentId={studentData.id}
          isUserBlocked={studentData.status === 'blocked'}
        />
      </div>
    </div>
  );
};

export default QuestionPractice;