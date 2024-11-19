import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Loader2 } from "lucide-react";
import { downloadExcelTemplate, processExcelFile } from "@/utils/excelUtils";
import { supabase } from "@/integrations/supabase/client";
import { QuestionFilters } from "./questions/QuestionFilters";
import { QuestionsTable } from "./questions/QuestionsTable";

export const QuestionImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchSubjectsAndTopics = async () => {
    console.log("Buscando matérias e tópicos únicos...");
    const { data: questionsData, error } = await supabase
      .from("questions")
      .select("subject, topic");

    if (error) {
      console.error("Erro ao buscar matérias e tópicos:", error);
      return;
    }

    const uniqueSubjects = [...new Set(questionsData.map((q) => q.subject))];
    const uniqueTopics = [...new Set(questionsData.map((q) => q.topic).filter(Boolean))];

    console.log("Matérias encontradas:", uniqueSubjects);
    console.log("Tópicos encontrados:", uniqueTopics);

    setSubjects(uniqueSubjects);
    setTopics(uniqueTopics);
  };

  const fetchQuestions = async () => {
    console.log("Buscando questões do banco...");
    let query = supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (selectedSubject !== "all") {
      query = query.eq("subject", selectedSubject);
    }
    if (selectedTopic !== "all") {
      query = query.eq("topic", selectedTopic);
    }
    if (searchTerm) {
      query = query.ilike("text", `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões do banco de dados.",
        variant: "destructive",
      });
      return;
    }

    console.log("Questões carregadas:", data);
    setQuestions(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Iniciando upload do arquivo:", file.name);
    setIsUploading(true);
    toast({
      title: "Processando arquivo",
      description: "Aguarde enquanto importamos as questões...",
    });

    try {
      const insertedQuestions = await processExcelFile(file);
      console.log("Questões processadas com sucesso:", insertedQuestions);

      toast({
        title: "Sucesso!",
        description: `${insertedQuestions.length} questões foram importadas com sucesso.`,
      });

      await fetchQuestions();
      await fetchSubjectsAndTopics();
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro ao importar questões",
        description: "Verifique se o arquivo está no formato correto e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium">Instruções para importação:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Baixe o modelo de planilha clicando no botão abaixo</li>
          <li>Preencha as questões seguindo o formato do modelo</li>
          <li>Não modifique as colunas ou sua ordem</li>
          <li>Salve o arquivo em formato .xlsx ou .csv</li>
          <li>Faça upload do arquivo preenchido</li>
        </ol>
      </div>

      <div className="flex gap-2">
        <Button className="w-full flex items-center gap-2" onClick={downloadExcelTemplate}>
          <Download className="h-4 w-4" />
          Baixar Modelo de Planilha
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowQuestions(true);
                fetchQuestions();
                fetchSubjectsAndTopics();
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
              subjects={subjects}
              topics={topics}
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              searchTerm={searchTerm}
              onSubjectChange={setSelectedSubject}
              onTopicChange={setSelectedTopic}
              onSearchChange={setSearchTerm}
              onFilter={fetchQuestions}
            />

            <QuestionsTable questions={questions} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          id="file-upload"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            isUploading ? "opacity-50" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando arquivo...</span>
            </div>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste um arquivo
              </span>
              <span className="text-xs text-gray-400">Suporta arquivos CSV e Excel</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};