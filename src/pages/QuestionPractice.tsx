import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import QuestionCard from "@/components/student/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const QuestionPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  // Buscar o ID do estudante da sessão
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log("Buscando sessão do usuário...");
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao buscar sessão:", error);
        return null;
      }
      console.log("Sessão encontrada:", session);
      return session;
    },
  });

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      console.log("Buscando questões do Supabase...");
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar questões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões. Tente novamente mais tarde.",
        });
        throw error;
      }

      console.log("Questões buscadas com sucesso:", data?.length, "questões");
      return data || [];
    },
  });

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Usuário não autenticado
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Faça login para acessar as questões
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
          studentId={session.user.id}
        />
      </div>
    </div>
  );
};

export default QuestionPractice;