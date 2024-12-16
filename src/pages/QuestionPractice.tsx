import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider, useQuestion } from "@/features/questions/contexts/QuestionContext";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";
import { PreviewUser } from "@/types/user";

interface QuestionPracticeProps {
  previewUser?: PreviewUser;
}

const QuestionPracticeContent = () => {
  const {
    currentQuestionIndex,
    studentData,
    questions,
    isLoadingQuestions,
    error,
    handleNextQuestion,
    handlePreviousQuestion,
    currentQuestion
  } = useQuestion();

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center">
        <div className="max-w-4xl w-full mx-auto">
          <Skeleton className="h-[calc(100vh-2rem)] w-full rounded-xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Erro ao carregar questões
          </h2>
          <p className="text-gray-600">
            Por favor, tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhuma questão disponível
          </h2>
          <p className="text-gray-600">
            Aguarde até que novas questões sejam adicionadas
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center relative z-10">
        <div className="max-w-4xl w-full mx-auto">
          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <QuestionCard
              question={{
                id: currentQuestion.id,
                text: currentQuestion.text,
                options: [
                  { id: 'A', text: currentQuestion.option_a },
                  { id: 'B', text: currentQuestion.option_b },
                  { id: 'C', text: currentQuestion.option_c },
                  { id: 'D', text: currentQuestion.option_d },
                  { id: 'E', text: currentQuestion.option_e }
                ],
                correctAnswer: currentQuestion.correct_answer,
                explanation: currentQuestion.explanation,
                subject: currentQuestion.subject,
                topic: currentQuestion.topic,
                examYear: currentQuestion.exam_year,
                isFromPreviousExam: currentQuestion.is_from_previous_exam,
                imageUrl: currentQuestion.image_url
              }}
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
    </div>
  );
};

const QuestionPractice = ({ previewUser }: QuestionPracticeProps) => {
  return (
    <QuestionProvider>
      <ExamModeProvider>
        <QuestionPracticeContent />
      </ExamModeProvider>
    </QuestionProvider>
  );
};

export default QuestionPractice;