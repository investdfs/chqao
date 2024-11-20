import { useState } from "react";
import { ExcelTemplateSection } from "./questions/ExcelTemplateSection";
import { FileUploadSection } from "./questions/FileUploadSection";
import { DownloadQuestions } from "./questions/DownloadQuestions";
import { UpdateHistory } from "./questions/UpdateHistory";
import { QuestionFilters } from "./questions/QuestionFilters";
import { QuestionsTable } from "./questions/QuestionsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const fetchThemesSubjectsAndTopics = async () => {
    console.log("Buscando temas, matérias e assuntos únicos...");
    const { data: questionsData, error } = await supabase
      .from("questions")
      .select("theme, subject, topic");

    if (error) {
      console.error("Erro ao buscar temas, matérias e assuntos:", error);
      return;
    }

    const uniqueThemes = [...new Set(questionsData.map((q) => q.theme).filter(Boolean))];
    const uniqueSubjects = [...new Set(questionsData.map((q) => q.subject))];
    const uniqueTopics = [...new Set(questionsData.map((q) => q.topic).filter(Boolean))];

    setThemes(uniqueThemes);
    setSubjects(uniqueSubjects);
    setTopics(uniqueTopics);
  };

  const fetchQuestions = async () => {
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

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar questões:", error);
      return;
    }

    setQuestions(data || []);
  };

  return (
    <div className="space-y-4">
      <ExcelTemplateSection />

      <div className="flex gap-2 flex-wrap">
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
      </div>

      <FileUploadSection />
    </div>
  );
};