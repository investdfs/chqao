import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, HelpCircle } from "lucide-react";
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CsvQuestion {
  'Matéria': string;
  'Tema': string;
  'Assunto': string;
  'Questão': string;
  'Opção A': string;
  'Opção B': string;
  'Opção C': string;
  'Opção D': string;
  'Opção E': string;
  'Resposta Correta': string;
  'Explicação': string;
  'Dificuldade': 'Fácil' | 'Médio' | 'Difícil';
  'Questão de Concurso': string;
  'Ano': string;
  'Nome do Concurso': string;
}

export const CsvImporter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCSV = async (file: File): Promise<CsvQuestion[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<CsvQuestion>(file, {
        header: true,
        delimiter: ';', // Especifica o ponto e vírgula como delimitador
        skipEmptyLines: true,
        encoding: 'UTF-8', // Garante suporte a caracteres especiais
        complete: (results) => {
          console.log('CSV parsed:', results);
          resolve(results.data);
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          reject(error);
        }
      });
    });
  };

  const validateQuestion = (question: CsvQuestion) => {
    const requiredFields = [
      'Matéria',
      'Tema',
      'Assunto',
      'Questão',
      'Opção A',
      'Opção B',
      'Opção C',
      'Opção D',
      'Opção E',
      'Resposta Correta',
      'Explicação'
    ];

    for (const field of requiredFields) {
      if (!question[field as keyof CsvQuestion]) {
        throw new Error(`Campo obrigatório faltando: ${field}`);
      }
    }

    if (!'ABCDE'.includes(question['Resposta Correta'].toUpperCase())) {
      throw new Error('Resposta correta deve ser A, B, C, D ou E');
    }

    if (question['Dificuldade'] && !['Fácil', 'Médio', 'Difícil'].includes(question['Dificuldade'])) {
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
              subject: question['Matéria'],
              theme: question['Tema'],
              topic: question['Assunto'],
              text: question['Questão'],
              option_a: question['Opção A'],
              option_b: question['Opção B'],
              option_c: question['Opção C'],
              option_d: question['Opção D'],
              option_e: question['Opção E'],
              correct_answer: question['Resposta Correta'].toUpperCase(),
              explanation: question['Explicação'],
              difficulty: question['Dificuldade'] || 'Médio',
              is_from_previous_exam: question['Questão de Concurso'] === 'Sim',
              exam_year: question['Ano'] ? parseInt(question['Ano']) : null,
              exam_name: question['Nome do Concurso'] || null,
              status: 'active'
            });

          if (error) {
            console.error('Erro ao inserir questão:', error);
            throw error;
          }
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

  // ... keep existing code (Dialog and UI components)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Importar CSV</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Formato do CSV</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <p>O arquivo CSV deve seguir exatamente este formato:</p>
                  <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                    <p>Cabeçalho obrigatório (com ponto e vírgula como separador):</p>
                    <code className="block bg-background p-2 rounded">
                      Matéria;Tema;Assunto;Questão;Opção A;Opção B;Opção C;Opção D;Opção E;Resposta Correta;Explicação;Dificuldade;Questão de Concurso;Ano;Nome do Concurso
                    </code>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p className="font-medium">Observações importantes:</p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Use ponto e vírgula (;) como separador</li>
                        <li>Mantenha a ordem exata das colunas</li>
                        <li>Salve o arquivo com codificação UTF-8</li>
                        <li>Resposta Correta deve ser A, B, C, D ou E</li>
                        <li>Dificuldade deve ser Fácil, Médio ou Difícil</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
              <span className="text-xs text-gray-500">
                Use ponto e vírgula (;) como separador
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
