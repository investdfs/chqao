import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useQuestionPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedExamYear, setSelectedExamYear] = useState<number>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student'],
    queryFn: async () => {
      console.log("Buscando dados do estudante...");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Erro ao buscar sessão:", sessionError);
        navigate("/login");
        return null;
      }

      if (!session?.user?.email) {
        console.log("Nenhum usuário logado");
        navigate("/login");
        return null;
      }

      console.log("Email do usuário logado:", session.user.email);

      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (studentError) {
        console.error("Erro ao buscar estudante:", studentError);
        if (studentError.code === 'PGRST116') {
          console.log("Estudante não encontrado para o email:", session.user.email);
        }
        navigate("/login");
        return null;
      }

      console.log("Dados do estudante encontrados:", student);
      return student;
    },
    retry: false
  });

  const { data: questions, isLoading: isLoadingQuestions, error } = useQuery({
    queryKey: ['questions', selectedExamYear],
    queryFn: async () => {
      console.log("Buscando questões do Supabase...");
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_from_previous_exam', true);

      if (selectedExamYear) {
        query = query.eq('exam_year', selectedExamYear);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar questões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões. Tente novamente mais tarde.",
        });
        throw error;
      }

      console.log(`Questões buscadas com sucesso para o ano ${selectedExamYear}:`, data?.length, "questões");
      return data || [];
    },
    enabled: !!studentData
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

  return {
    currentQuestionIndex,
    studentData,
    questions,
    isLoadingStudent,
    isLoadingQuestions,
    error,
    handleNextQuestion,
    handlePreviousQuestion,
    selectedExamYear,
    setSelectedExamYear
  };
};