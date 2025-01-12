import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import Papa from 'papaparse';

interface CsvQuestion {
  subject: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  topic?: string;
  theme?: string;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  is_from_previous_exam?: string;
  exam_year?: string;
  exam_name?: string;
}

export const CsvImporter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCSV = async (file: File): Promise<CsvQuestion[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<CsvQuestion>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
  };

  const validateQuestion = (question: CsvQuestion) => {
    const requiredFields = [
      'subject',
      'text',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'option_e',
      'correct_answer',
      'explanation'
    ];

    for (const field of requiredFields) {
      if (!question[field as keyof CsvQuestion]) {
        throw new Error(`Campo obrigatório faltando: ${field}`);
      }
    }

    if (!'ABCDE'.includes(question.correct_answer.toUpperCase())) {
      throw new Error('Resposta correta deve ser A, B, C, D ou E');
    }

    if (question.difficulty && !['Fácil', 'Médio', 'Difícil'].includes(question.difficulty)) {
      throw new Error('Dificuldade deve ser Fácil, Médio ou Difícil');
    }

    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Iniciando processamento do arquivo CSV:', file.name);

      const questions = await processCSV(file);
      console.log(`Processadas ${questions.length} questões do CSV`);

      let successCount = 0;
      let errorCount = 0;

      for (const question of questions) {
        try {
          validateQuestion(question);

          const { error } = await supabase
            .from('questions')
            .insert({
              subject: question.subject,
              topic: question.topic || null,
              theme: question.theme || null,
              text: question.text,
              option_a: question.option_a,
              option_b: question.option_b,
              option_c: question.option_c,
              option_d: question.option_d,
              option_e: question.option_e,
              correct_answer: question.correct_answer.toUpperCase(),
              explanation: question.explanation,
              difficulty: question.difficulty || 'Médio',
              is_from_previous_exam: question.is_from_previous_exam === 'Sim',
              exam_year: question.exam_year ? parseInt(question.exam_year) : null,
              exam_name: question.exam_name || null,
              status: 'active'
            });

          if (error) throw error;
          successCount++;

        } catch (error) {
          console.error('Erro ao processar questão:', error);
          errorCount++;
        }
      }

      toast({
        title: "Importação concluída",
        description: `${successCount} questões importadas com sucesso. ${errorCount} erros.`,
        variant: successCount > 0 ? "default" : "destructive"
      });

    } catch (error: any) {
      console.error('Erro ao processar arquivo CSV:', error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium">Instruções para importação CSV:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Use ponto e vírgula (;) como separador</li>
          <li>A primeira linha deve conter os nomes das colunas</li>
          <li>Colunas obrigatórias: subject, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation</li>
          <li>Colunas opcionais: topic, theme, difficulty, is_from_previous_exam, exam_year, exam_name</li>
          <li>Resposta correta deve ser A, B, C, D ou E</li>
          <li>Dificuldade deve ser Fácil, Médio ou Difícil</li>
        </ol>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csv-upload"
          onChange={handleFileUpload}
          disabled={isProcessing}
        />
        <label
          htmlFor="csv-upload"
          className={`cursor-pointer flex flex-col items-center space-y-2 ${
            isProcessing ? "opacity-50" : ""
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processando arquivo...</span>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste um arquivo CSV
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};