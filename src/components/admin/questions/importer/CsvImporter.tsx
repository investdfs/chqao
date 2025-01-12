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
                  <p>Para gerar questões no formato CSV correto, use o seguinte prompt com a IA:</p>
                  <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                    <p>Gere questões de múltipla escolha no formato CSV com ponto e vírgula (;) como separador, seguindo esta estrutura:</p>
                    <p>Cabeçalho obrigatório:</p>
                    <code className="block bg-background p-2 rounded">
                      Matéria;Tema;Assunto;Questão;Opção A;Opção B;Opção C;Opção D;Opção E;Resposta Correta;Explicação;Dificuldade;Questão de Concurso;Ano;Nome do Concurso
                    </code>
                    
                    <p className="font-medium mt-4">Exemplo de prompt:</p>
                    <div className="bg-background p-2 rounded whitespace-pre-line">
                      Gere 5 questões de múltipla escolha seguindo exatamente esta estrutura:

                      Matéria: Língua Portuguesa
                      Tema: Verbos
                      Assunto: Conjugação Verbal

                      Regras:
                      1. Matéria deve ser uma das seguintes:
                      - Língua Portuguesa
                      - Geografia do Brasil
                      - História do Brasil
                      - Estatuto dos Militares
                      - Licitações e Contratos
                      - Regulamento de Administração do Exército (RAE)
                      - Direito Militar e Sindicância
                      
                      2. Cada questão deve ter:
                      - Texto claro e objetivo
                      - 5 alternativas (A a E)
                      - Apenas UMA resposta correta
                      - Explicação detalhada da resposta
                      - Dificuldade (Fácil, Médio ou Difícil)
                      
                      3. Formato:
                      - Sem formatação especial
                      - Sem quebras de linha
                      - Sem caracteres especiais
                      - Campos separados por ponto e vírgula
                      
                      4. Exemplo de linha CSV:
                      Língua Portuguesa;Verbos;Conjugação Verbal;Em relação à conjugação do verbo "fazer" no presente do indicativo, assinale a alternativa correta:;Eu fazo;Eu faz;Eu faço;Eu fasso;Eu fasso;C;A forma correta é "eu faço". O verbo "fazer" é irregular e sua conjugação na primeira pessoa do singular do presente do indicativo é "faço".;Fácil;Não;;;
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      <p className="font-medium">Observações importantes:</p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Use um editor de planilhas para criar o arquivo e salve como CSV</li>
                        <li>Certifique-se de que o separador seja ponto e vírgula (;)</li>
                        <li>Mantenha a ordem exata das colunas conforme o exemplo</li>
                        <li>Não use aspas nos textos, a menos que seja absolutamente necessário</li>
                        <li>Verifique se não há linhas em branco no arquivo</li>
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
