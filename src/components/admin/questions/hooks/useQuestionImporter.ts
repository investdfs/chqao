import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";

export const useQuestionImporter = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { toast } = useToast();

  const fetchThemesSubjectsAndTopics = async () => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      console.log("Buscando temas, matérias e assuntos únicos...");
      const { data: questionsData, error } = await supabase
        .from("questions")
        .select("theme, subject, topic")
        .throwOnError();

      if (error) throw error;

      const uniqueThemes = [...new Set(questionsData.map((q) => q.theme).filter(Boolean))];
      const uniqueSubjects = [...new Set(questionsData.map((q) => q.subject))];
      const uniqueTopics = [...new Set(questionsData.map((q) => q.topic).filter(Boolean))];

      setThemes(uniqueThemes);
      setSubjects(uniqueSubjects);
      setTopics(uniqueTopics);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os filtros. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      console.log("Buscando questões do banco...");
      let query = supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedTheme !== "all") query = query.eq("theme", selectedTheme);
      if (selectedSubject !== "all") query = query.eq("subject", selectedSubject);
      if (selectedTopic !== "all") query = query.eq("topic", selectedTopic);
      if (searchTerm) query = query.ilike("text", `%${searchTerm}%`);

      const { data, error } = await query.throwOnError();
      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Ocorreu um erro ao carregar as questões. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      console.log("Iniciando reset do banco de questões...");
      const { error } = await supabase
        .from("questions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast({
        title: "Banco resetado",
        description: "Todas as questões foram removidas com sucesso.",
      });

      setQuestions([]);
      setShowResetDialog(false);
    } catch (error) {
      console.error("Erro ao resetar banco:", error);
      toast({
        title: "Erro ao resetar",
        description: "Não foi possível resetar o banco de questões.",
        variant: "destructive",
      });
    }
  };

  return {
    questions,
    showQuestions,
    setShowQuestions,
    themes,
    subjects,
    topics,
    selectedTheme,
    selectedSubject,
    selectedTopic,
    searchTerm,
    showResetDialog,
    setShowResetDialog,
    setSelectedTheme,
    setSelectedSubject,
    setSelectedTopic,
    setSearchTerm,
    fetchQuestions,
    fetchThemesSubjectsAndTopics,
    handleResetDatabase
  };
};