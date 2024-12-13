import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { useQuestion } from "@/features/questions/contexts/QuestionContext";

const QuestionPractice = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    isLoadingQuestions,
    handleNextQuestion,
    handlePreviousQuestion,
    studentData,
  } = useQuestion();

  console.log("Rendering QuestionPractice with currentQuestion:", currentQuestion);

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          question={currentQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          studentId={studentData?.id}
          showQuestionId={false}
        />
      </div>
    </div>
  );
};

export default QuestionPractice;