import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

interface CsvQuestion {
  Tema: string;
  Assunto: string;
  Questão: string;
  'URL da Imagem'?: string;
  'Opção A': string;
  'Opção B': string;
  'Opção C': string;
  'Opção D': string;
  'Opção E': string;
  'Resposta Correta': string;
  Explicação: string;
  Dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  'Questão de Concurso'?: string;
  Ano?: string;
  'Nome do Concurso'?: string;
}

const validateQuestion = (question: CsvQuestion): string | null => {
  if (!question.Questão?.trim()) {
    return "O texto da questão é obrigatório";
  }
  if (!question.Tema?.trim()) {
    return "O tema é obrigatório";
  }
  if (!question.Assunto?.trim()) {
    return "O assunto é obrigatório";
  }
  if (!question['Opção A']?.trim()) {
    return "A opção A é obrigatória";
  }
  if (!question['Opção B']?.trim()) {
    return "A opção B é obrigatória";
  }
  if (!question['Opção C']?.trim()) {
    return "A opção C é obrigatória";
  }
  if (!question['Opção D']?.trim()) {
    return "A opção D é obrigatória";
  }
  if (!question['Opção E']?.trim()) {
    return "A opção E é obrigatória";
  }
  if (!question['Resposta Correta']?.match(/^[A-E]$/)) {
    return "A resposta correta deve ser A, B, C, D ou E";
  }
  if (!question.Explicação?.trim()) {
    return "A explicação é obrigatória";
  }
  if (!['Fácil', 'Médio', 'Difícil'].includes(question.Dificuldade)) {
    return "A dificuldade deve ser Fácil, Médio ou Difícil";
  }
  return null;
};

const transformQuestion = (csvQuestion: CsvQuestion) => {
  return {
    text: csvQuestion.Questão.trim(),
    theme: csvQuestion.Tema.trim(),
    topic: csvQuestion.Assunto.trim(),
    image_url: csvQuestion['URL da Imagem']?.trim() || null,
    option_a: csvQuestion['Opção A'].trim(),
    option_b: csvQuestion['Opção B'].trim(),
    option_c: csvQuestion['Opção C'].trim(),
    option_d: csvQuestion['Opção D'].trim(),
    option_e: csvQuestion['Opção E'].trim(),
    correct_answer: csvQuestion['Resposta Correta'].trim(),
    explanation: csvQuestion.Explicação.trim(),
    difficulty: csvQuestion.Dificuldade,
    is_from_previous_exam: csvQuestion['Questão de Concurso']?.toLowerCase() === 'sim',
    exam_year: csvQuestion.Ano ? parseInt(csvQuestion.Ano) : null,
    exam_name: csvQuestion['Nome do Concurso']?.trim() || null,
    status: 'active'
  };
};

export const CsvImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processQuestions = async (questions: CsvQuestion[]) => {
    console.log('Processando questões do CSV...');
    const validQuestions = [];
    const errors = [];

    for (const [index, question] of questions.entries()) {
      const validationError = validateQuestion(question);
      if (validationError) {
        errors.push(`Linha ${index + 2}: ${validationError}`);
        continue;
      }

      try {
        validQuestions.push(transformQuestion(question));
      } catch (error) {
        errors.push(`Linha ${index + 2}: Erro ao processar questão - ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Erros encontrados:\n${errors.join('\n')}`);
    }

    const { error: insertError } = await supabase
      .from('questions')
      .insert(validQuestions);

    if (insertError) {
      console.error('Erro ao inserir questões:', insertError);
      throw new Error(`Erro ao inserir questões: ${insertError.message}`);
    }

    return validQuestions.length;
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
        encoding: "UTF-8",
        complete: async (results) => {
          try {
            setProgress(30);
            const insertedCount = await processQuestions(results.data as CsvQuestion[]);
            setProgress(100);
            
            toast({
              title: "Sucesso!",
              description: `${insertedCount} questões foram importadas com sucesso.`,
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
            if (event.target) {
              event.target.value = "";
            }
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
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
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
                O arquivo deve seguir o template fornecido
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};