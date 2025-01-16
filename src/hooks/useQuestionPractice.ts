import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/questions/common";

export const useQuestionPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedExamYear, setSelectedExamYear] = useState<number>();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Obter a matéria selecionada da URL
  const searchParams = new URLSearchParams(window.location.search);
  const selectedSubject = searchParams.get('subject');

  console.log("Matéria selecionada:", selectedSubject);

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

      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (studentError) {
        console.error("Erro ao buscar estudante:", studentError);
        navigate("/login");
        return null;
      }

      return student;
    },
    retry: false
  });

  const { data: questions = [], isLoading: isLoadingQuestions, error } = useQuery({
    queryKey: ['questions', selectedSubject],
    queryFn: async () => {
      if (!selectedSubject) {
        console.log("Nenhuma matéria selecionada, retornando array vazio");
        return [];
      }

      console.log("Buscando questões para a matéria:", selectedSubject);
      
      // Buscar questões diretamente da tabela com filtros específicos
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('status', 'active')
        .eq('is_from_previous_exam', false)
        .order('created_at');

      if (error) {
        console.error("Erro ao buscar questões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões. Tente novamente mais tarde.",
        });
        throw error;
      }

      console.log(`${data?.length || 0} questões encontradas para a matéria ${selectedSubject}`);
      
      // Validar se há questões
      if (!data || data.length === 0) {
        toast({
          title: "Nenhuma questão encontrada",
          description: `Não há questões disponíveis para a matéria ${selectedSubject}`,
        });
        return [];
      }

      return data as Question[];
    },
    enabled: !!selectedSubject,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
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

  // Reset o índice quando mudar a matéria
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [selectedSubject]);

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