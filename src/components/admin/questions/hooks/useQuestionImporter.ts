import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useQuestionImporter = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchQuestions = async () => {
    console.log("Buscando questões com filtros:", {
      subject: selectedSubject,
      topic: selectedTopic,
      searchTerm
    });

    try {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedSubject) {
        console.log("Filtrando por matéria:", selectedSubject);
        query = query.eq('subject', selectedSubject);
      }

      if (selectedTopic) {
        console.log("Filtrando por tópico:", selectedTopic);
        query = query.eq('topic', selectedTopic);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("Questões encontradas:", data?.length);
      setQuestions(data || []);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const fetchThemesSubjectsAndTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('subject_structure')
        .select('*')
        .order('name');

      if (error) throw error;

      console.log("Estrutura de matérias carregada:", data?.length, "itens");
    } catch (error) {
      console.error("Erro ao carregar estrutura de matérias:", error);
      toast({
        title: "Erro ao carregar estrutura",
        description: "Não foi possível carregar a estrutura de matérias.",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      toast({
        title: "Banco resetado com sucesso",
        description: "Todas as questões foram removidas.",
      });

      setShowResetDialog(false);
      setQuestions([]);
    } catch (error) {
      console.error("Erro ao resetar banco:", error);
      toast({
        title: "Erro ao resetar banco",
        description: "Não foi possível resetar o banco de questões.",
        variant: "destructive",
      });
    }
  };

  return {
    questions,
    showQuestions,
    setShowQuestions,
    selectedSubject,
    selectedTopic,
    searchTerm,
    showResetDialog,
    setShowResetDialog,
    setSelectedSubject,
    setSelectedTopic,
    setSearchTerm,
    fetchQuestions,
    fetchThemesSubjectsAndTopics,
    handleResetDatabase
  };
};