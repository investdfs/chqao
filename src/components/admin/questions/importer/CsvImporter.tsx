import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

export const CsvImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processQuestions = async (questions: any[]) => {
    console.log('Processando questões do CSV...');
    
    const regularQuestions = [];
    const examQuestions = [];

    for (const question of questions) {
      const isExamQuestion = question['Questão de Concurso']?.toUpperCase() === 'SIM';
      const baseQuestion = {
        subject: question['Matéria'],
        theme: question['Tema'],
        topic: question['Assunto'],
        text: question['Questão'],
        option_a: question['Opção A'],
        option_b: question['Opção B'],
        option_c: question['Opção C'],
        option_d: question['Opção D'],
        option_e: question['Opção E'],
        correct_answer: question['Resposta Correta'],
        explanation: question['Explicação'],
        difficulty: question['Dificuldade'] || 'Médio',
        status: 'active'
      };

      if (isExamQuestion) {
        console.log('Processando questão de concurso:', question['Questão']);
        
        // Criar ou obter o exame
        const { data: examData, error: examError } = await supabase
          .from('previous_exams')
          .select('id')
          .eq('year', parseInt(question['Ano']))
          .single();

        if (examError && examError.code !== 'PGRST116') {
          console.error('Erro ao buscar exame:', examError);
          throw examError;
        }

        let examId;
        if (!examData) {
          const { data: newExam, error: createError } = await supabase
            .from('previous_exams')
            .insert({
              year: parseInt(question['Ano']),
              name: question['Nome do Concurso'] || 'EIPS/CHQAO',
              description: `Questões do concurso ${question['Nome do Concurso'] || 'EIPS/CHQAO'} ${question['Ano']}`
            })
            .select('id')
            .single();

          if (createError) {
            console.error('Erro ao criar exame:', createError);
            throw createError;
          }
          examId = newExam.id;
        } else {
          examId = examData.id;
        }

        examQuestions.push({
          ...baseQuestion,
          exam_id: examId
        });
      } else {
        console.log('Processando questão regular:', question['Questão']);
        regularQuestions.push({
          ...baseQuestion,
          is_from_previous_exam: false
        });
      }
    }

    // Inserir questões regulares
    if (regularQuestions.length > 0) {
      const { error: regularError } = await supabase
        .from('questions')
        .insert(regularQuestions);

      if (regularError) {
        console.error('Erro ao inserir questões regulares:', regularError);
        throw regularError;
      }
    }

    // Inserir questões de concurso
    if (examQuestions.length > 0) {
      const { error: examError } = await supabase
        .from('previous_exam_questions')
        .insert(examQuestions);

      if (examError) {
        console.error('Erro ao inserir questões de concurso:', examError);
        throw examError;
      }
    }

    return {
      regularCount: regularQuestions.length,
      examCount: examQuestions.length
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(10);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          try {
            setProgress(30);
            const { regularCount, examCount } = await processQuestions(results.data);
            setProgress(100);
            
            toast({
              title: "Sucesso!",
              description: `${regularCount} questões regulares e ${examCount} questões de concurso foram importadas.`,
            });
          } catch (error: any) {
            console.error("Erro ao processar questões:", error);
            setError(error.message);
            toast({
              title: "Erro ao importar questões",
              description: error.message || "Verifique se o arquivo está no formato correto.",
              variant: "destructive",
            });
          } finally {
            setIsUploading(false);
            setProgress(0);
          }
        },
        error: (error) => {
          console.error("Erro ao fazer parse do CSV:", error);
          setError(error.message);
          setIsUploading(false);
          setProgress(0);
          toast({
            title: "Erro ao ler arquivo",
            description: "O arquivo CSV está em formato inválido.",
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      console.error("Erro ao ler arquivo:", error);
      setError(error.message);
      setIsUploading(false);
      setProgress(0);
      toast({
        title: "Erro ao ler arquivo",
        description: error.message || "Não foi possível ler o arquivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csv-upload"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="csv-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            isUploading ? "opacity-50" : ""
          }`}
        >
          {isUploading ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processando arquivo...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste um arquivo CSV
              </span>
              <span className="text-xs text-gray-400">
                O arquivo deve conter as colunas: Matéria, Tema, Assunto, Questão, Opções A-E, 
                Resposta Correta, Explicação, Questão de Concurso (SIM/NÃO), Ano, Nome do Concurso
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};