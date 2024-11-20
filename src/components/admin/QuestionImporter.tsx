import { useState } from "react";
import { ExcelTemplateSection } from "./questions/ExcelTemplateSection";
import { FileUploadSection } from "./questions/FileUploadSection";
import { DownloadQuestions } from "./questions/DownloadQuestions";
import { UpdateHistory } from "./questions/UpdateHistory";
import { QuestionFilters } from "./questions/QuestionFilters";
import { QuestionsTable } from "./questions/QuestionsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const QuestionImporter = () => {
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

      if (error) {
        console.error("Erro ao buscar temas, matérias e assuntos:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os filtros de questões.",
          variant: "destructive",
        });
        return;
      }

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

      if (selectedTheme !== "all") {
        query = query.eq("theme", selectedTheme);
      }
      if (selectedSubject !== "all") {
        query = query.eq("subject", selectedSubject);
      }
      if (selectedTopic !== "all") {
        query = query.eq("topic", selectedTopic);
      }
      if (searchTerm) {
        query = query.ilike("text", `%${searchTerm}%`);
      }

      const { data, error } = await query.throwOnError();

      if (error) {
        console.error("Erro ao buscar questões:", error);
        toast({
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

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
        .neq("id", "placeholder"); // Delete all records

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

  return (
    <div className="space-y-4">
      <ExcelTemplateSection />

      <div className="flex flex-wrap justify-center gap-4">
        <DownloadQuestions />
        <UpdateHistory />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowQuestions(true);
                fetchQuestions();
                fetchThemesSubjectsAndTopics();
              }}
            >
              <Eye className="h-4 w-4" />
              Ver Questões ({questions.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Questões Cadastradas</DialogTitle>
            </DialogHeader>

            <QuestionFilters
              themes={themes}
              subjects={subjects}
              topics={topics}
              selectedTheme={selectedTheme}
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              searchTerm={searchTerm}
              onThemeChange={setSelectedTheme}
              onSubjectChange={setSelectedSubject}
              onTopicChange={setSelectedTopic}
              onSearchChange={setSearchTerm}
              onFilter={fetchQuestions}
            />

            <QuestionsTable questions={questions} />
          </DialogContent>
        </Dialog>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Resetar Banco
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Reset</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja apagar todas as questões do banco de dados? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleResetDatabase}>
                Confirmar Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <FileUploadSection />
    </div>
  );
};
