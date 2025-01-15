import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider, useQuestion } from "@/features/questions/contexts/QuestionContext";
import { ExamModeProvider } from "@/features/questions/contexts/ExamModeContext";
import { PreviewUser } from "@/types/user";
import { SubjectSelect } from "@/components/student/question/filters/SubjectSelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface QuestionPracticeProps {
  previewUser?: PreviewUser;
}

const QuestionPracticeContent = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  
  const { data: subjectStructure } = useQuery({
    queryKey: ['subject-hierarchy'],
    queryFn: async () => {
      console.log("Fetching subject hierarchy...");
      const { data, error } = await supabase.rpc('get_subject_hierarchy');
      
      if (error) {
        console.error("Error fetching subject hierarchy:", error);
        throw error;
      }
      
      console.log("Subject hierarchy data:", data);
      return data;
    }
  });

  const subjects = subjectStructure?.filter(node => node.level === 1) || [];

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

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Selecione uma matéria
          </h2>
          <SubjectSelect
            value={selectedSubject}
            onChange={setSelectedSubject}
            subjects={subjects}
          />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhuma questão disponível para esta matéria
          </h2>
          <p className="text-gray-600 mb-6">
            Selecione outra matéria ou aguarde até que novas questões sejam adicionadas
          </p>
          <SubjectSelect
            value={selectedSubject}
            onChange={setSelectedSubject}
            subjects={subjects}
          />
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex flex-col relative overflow-hidden">
      <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto">
          <SubjectSelect
            value={selectedSubject}
            onChange={setSelectedSubject}
            subjects={subjects}
          />
        </div>
      </div>
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