import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Loader2, Search } from "lucide-react";
import { downloadExcelTemplate, processExcelFile } from "@/utils/excelUtils";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const QuestionImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchSubjectsAndTopics = async () => {
    console.log('Buscando matérias e tópicos únicos...');
    const { data: questionsData, error } = await supabase
      .from('questions')
      .select('subject, topic');

    if (error) {
      console.error('Erro ao buscar matérias e tópicos:', error);
      return;
    }

    const uniqueSubjects = [...new Set(questionsData.map(q => q.subject))];
    const uniqueTopics = [...new Set(questionsData.map(q => q.topic).filter(Boolean))];
    
    console.log('Matérias encontradas:', uniqueSubjects);
    console.log('Tópicos encontrados:', uniqueTopics);
    
    setSubjects(uniqueSubjects);
    setTopics(uniqueTopics);
  };

  const fetchQuestions = async () => {
    console.log('Buscando questões do banco...');
    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedSubject) {
      query = query.eq('subject', selectedSubject);
    }
    if (selectedTopic) {
      query = query.eq('topic', selectedTopic);
    }
    if (searchTerm) {
      query = query.ilike('text', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar questões:', error);
      toast({
        title: "Erro ao carregar questões",
        description: "Não foi possível carregar as questões do banco de dados.",
        variant: "destructive"
      });
      return;
    }

    console.log('Questões carregadas:', data);
    setQuestions(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Iniciando upload do arquivo:', file.name);
    setIsUploading(true);
    toast({
      title: "Processando arquivo",
      description: "Aguarde enquanto importamos as questões...",
    });

    try {
      const insertedQuestions = await processExcelFile(file);
      console.log('Questões processadas com sucesso:', insertedQuestions);

      toast({
        title: "Sucesso!",
        description: `${insertedQuestions.length} questões foram importadas com sucesso.`,
      });

      await fetchQuestions();
      await fetchSubjectsAndTopics();
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro ao importar questões",
        description: "Verifique se o arquivo está no formato correto e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
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
        <Button 
          className="w-full flex items-center gap-2" 
          onClick={downloadExcelTemplate}
        >
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
            
            <div className="space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as matérias</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por tópico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tópicos</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar questões..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Button 
                  variant="secondary"
                  onClick={() => {
                    fetchQuestions();
                  }}
                >
                  Filtrar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Tópico</TableHead>
                  <TableHead>Questão</TableHead>
                  <TableHead>Resposta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.subject}</TableCell>
                    <TableCell>{question.topic}</TableCell>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>{question.correct_answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          className={`cursor-pointer flex flex-col items-center space-y-2 ${isUploading ? 'opacity-50' : ''}`}
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
              <span className="text-xs text-gray-400">
                Suporta arquivos CSV e Excel
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};