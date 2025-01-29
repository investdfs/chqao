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

      console.log("Iniciando busca de questões para matéria:", selectedSubject);
      
      // Usar a função RPC get_filtered_questions com logs detalhados
      const { data, error } = await supabase
        .rpc('get_filtered_questions', {
          p_subject: selectedSubject
        });

      if (error) {
        console.error("Erro ao buscar questões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões. Tente novamente mais tarde.",
        });
        throw error;
      }

      console.log(`Questões retornadas para ${selectedSubject}:`, {
        totalQuestoes: data?.length || 0,
        primeiraQuestao: data?.[0],
        ultimaQuestao: data?.[data?.length - 1]
      });
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhuma questão encontrada",
          description: `Não há questões disponíveis para a matéria ${selectedSubject}`,
        });
        return [];
      }

      // Verificar se todas as questões são da matéria correta
      const questoesIncorretas = data.filter(q => q.subject !== selectedSubject);
      if (questoesIncorretas.length > 0) {
        console.error("Encontradas questões de outras matérias:", {
          materiaEsperada: selectedSubject,
          questoesIncorretas: questoesIncorretas.map(q => ({
            id: q.id,
            materia: q.subject
          }))
        });
      }

      return data as Question[];
    },
    enabled: !!selectedSubject && !!studentData?.id,
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
    console.log("Matéria mudou, resetando índice da questão");
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