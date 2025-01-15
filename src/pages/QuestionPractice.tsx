import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider, useQuestion } from "@/features/questions/contexts/QuestionContext";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";
import { PreviewUser } from "@/types/user";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const selectedSubject = searchParams.get('subject');

  useEffect(() => {
    if (selectedSubject && questions.length === 0 && !isLoadingQuestions) {
      toast({
        title: "Nenhuma questão encontrada",
        description: `Não há questões disponíveis para a matéria ${selectedSubject}`,
      });
    }
  }, [selectedSubject, questions.length, isLoadingQuestions, toast]);

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center">
        <div className="max-w-4xl w-full mx-auto">
          <Skeleton className="h-[calc(100vh-2rem)] w-full rounded-xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Selecione uma matéria
          </h2>
          <p className="text-gray-600">
            Escolha uma matéria para começar a praticar
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
            Não há questões disponíveis para a matéria selecionada
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