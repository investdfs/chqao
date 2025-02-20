
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/questions/common";

const PREVIEW_QUESTIONS: Question[] = [
  {
    id: "preview-1",
    text: "Questão de exemplo 1: Qual é a capital do Brasil?",
    subject: "Geografia",
    topic: "Capitais",
    source: "Exemplo",
    option_a: "São Paulo",
    option_b: "Rio de Janeiro",
    option_c: "Brasília",
    option_d: "Salvador",
    option_e: "Belo Horizonte",
    correct_answer: "C",
    explanation: "Brasília é a capital do Brasil desde 1960.",
    status: "active",
    difficulty: "Fácil",
    created_at: new Date().toISOString(),
    theme: "Geografia do Brasil",
    is_from_previous_exam: false
  },
  {
    id: "preview-2",
    text: "Questão de exemplo 2: Quem escreveu 'Os Lusíadas'?",
    subject: "Literatura",
    topic: "Literatura Portuguesa",
    source: "Exemplo",
    option_a: "Fernando Pessoa",
    option_b: "Luís de Camões",
    option_c: "José Saramago",
    option_d: "Eça de Queirós",
    option_e: "Gil Vicente",
    correct_answer: "B",
    explanation: "Os Lusíadas foi escrito por Luís de Camões, sendo publicado em 1572.",
    status: "active",
    difficulty: "Médio",
    created_at: new Date().toISOString(),
    theme: "Literatura Portuguesa",
    is_from_previous_exam: false
  }
];

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
      if (process.env.NODE_ENV === 'development') {
        console.log("Ambiente de desenvolvimento - ignorando autenticação");
        return { id: 'preview-user-id' };
      }

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
      // Se estivermos em desenvolvimento e não houver matéria selecionada,
      // retornar as questões de preview
      if (process.env.NODE_ENV === 'development' && !selectedSubject) {
        console.log("Ambiente de desenvolvimento - usando questões de preview");
        return PREVIEW_QUESTIONS;
      }

      if (!selectedSubject) {
        console.log("Nenhuma matéria selecionada, retornando array vazio");
        return [];
      }

      console.log("Iniciando busca de questões para matéria:", selectedSubject);
      
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

      return data as Question[];
    },
    enabled: process.env.NODE_ENV === 'development' || !!selectedSubject,
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
