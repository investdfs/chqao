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

  // Obter a matéria selecionada da URL
  const searchParams = new URLSearchParams(window.location.search);
  const selectedSubject = searchParams.get('subject');

  console.log("Matéria selecionada no hook:", selectedSubject);

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
        navigate("/login");
        return null;
      }

      console.log("Dados do estudante encontrados:", student);
      return student;
    },
    retry: false
  });

  const { data: questions, isLoading: isLoadingQuestions, error } = useQuery({
    queryKey: ['questions', selectedSubject, selectedExamYear],
    queryFn: async () => {
      console.log("Buscando questões do Supabase...");
      console.log("Filtros aplicados:", { subject: selectedSubject, examYear: selectedExamYear });
      
      let query = supabase
        .from('questions')
        .select(`
          *,
          subject_structure!inner (
            subject,
            theme,
            topic
          )
        `)
        .eq('status', 'active');

      // Aplicar filtro por matéria se estiver definida
      if (selectedSubject) {
        query = query.eq('subject', selectedSubject);
      }

      // Filtrar questões de concurso ou práticas
      if (selectedExamYear) {
        query = query
          .eq('is_from_previous_exam', true)
          .eq('exam_year', selectedExamYear);
      } else {
        query = query.eq('is_from_previous_exam', false);
      }

      const { data, error } = await query
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

      console.log(`${data?.length || 0} questões encontradas para a matéria ${selectedSubject}`);
      return data || [];
    },
    enabled: !!studentData && (!!selectedSubject || !!selectedExamYear)
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