import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface QuestionInput {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
  theme: string;
  subject: string;
  topic: string;
}

export const InsertPreviousExamQuestionsButton = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const [examYear, setExamYear] = useState("");
  const [examName, setExamName] = useState("");
  const { toast } = useToast();

  const processQuestions = async (questionsText: string) => {
    try {
      // Transformar o texto em um array de objetos JSON
      const questionsArray = questionsText
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      console.log(`Processando ${questionsArray.length} questões...`);
      
      // Primeiro criar a prova
      const { data: examData, error: examError } = await supabase
        .from("previous_exams")
        .insert({
          year: parseInt(examYear),
          name: examName || `Prova ${examYear}`,
          description: `Prova do ano ${examYear}`
        })
        .select()
        .single();

      if (examError) throw examError;

      const processedQuestions = questionsArray.map((q: QuestionInput) => ({
        exam_id: examData.id,
        text: q.text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        option_e: q.option_e,
        correct_answer: q.correct_answer,
        explanation: q.explanation || "Gabarito Oficial",
        subject: q.subject,
        topic: q.topic,
        theme: q.theme
      }));

      return processedQuestions;
    } catch (error) {
      console.error("Erro ao processar JSON das questões:", error);
      throw new Error("Formato JSON inválido. Verifique se cada linha contém um objeto JSON válido.");
    }
  };

  const handleInsertQuestions = async () => {
    try {
      console.log("Processando questões de prova anterior...");
      const processedQuestions = await processQuestions(questions);

      if (processedQuestions.length === 0) {
        throw new Error("Nenhuma questão válida encontrada");
      }

      console.log(`Inserindo ${processedQuestions.length} questões...`);
      const { data, error } = await supabase
        .from("previous_exam_questions")
        .insert(processedQuestions)
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${processedQuestions.length} questões foram inseridas com sucesso.`,
      });
      
      setOpen(false);
      setQuestions("");
      setExamYear("");
      setExamName("");
    } catch (error) {
      console.error("Erro ao inserir questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: error.message || "Ocorreu um erro ao tentar inserir as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Inserir Questões de Provas Anteriores
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inserir Questões de Provas Anteriores</DialogTitle>
          <DialogDescription>
            Cole as questões no formato JSON, uma por linha. Cada questão deve conter os campos: text, options_a até option_e, correct_answer, explanation, difficulty, theme, subject e topic.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="examYear" className="text-sm font-medium">
              Ano da Prova
            </label>
            <Select value={examYear} onValueChange={setExamYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="examName" className="text-sm font-medium">
              Nome da Prova
            </label>
            <Input
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Ex: EsIE 2024"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="questions" className="text-sm font-medium">
              Questões (formato JSON)
            </label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder='Cole aqui as questões no formato JSON, uma por linha...'
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleInsertQuestions}
            disabled={!examYear || !questions.trim()}
          >
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};