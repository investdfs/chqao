import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const InsertPreviousExamQuestionsButton = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [examYear, setExamYear] = useState("");
  const { toast } = useToast();

  const processQuestions = (questionsText: string, answersText: string) => {
    const questionLines = questionsText.trim().split('\n');
    const answerLines = answersText.trim().split('\n');
    const processedQuestions = [];

    for (let i = 0; i < questionLines.length; i++) {
      const questionText = questionLines[i].trim();
      const answer = answerLines[i]?.trim() || '';
      
      if (questionText && answer) {
        const isValid = !answer.toLowerCase().includes('anulada');
        const explanation = isValid 
          ? "Gabarito Oficial EsIE - Questão Válida"
          : "Gabarito Oficial EsIE - Questão Anulada";

        processedQuestions.push({
          text: questionText,
          option_a: "A",
          option_b: "B",
          option_c: "C",
          option_d: "D",
          option_e: "E",
          correct_answer: answer.charAt(0).toUpperCase(),
          explanation,
          exam_year: parseInt(examYear),
          exam_name: "EsIE",
          is_from_previous_exam: true,
          subject: "Prova Anterior",
          theme: `Prova ${examYear}`,
          topic: `EsIE ${examYear}`
        });
      }
    }

    return processedQuestions;
  };

  const handleInsertQuestions = async () => {
    try {
      console.log("Processando questões de prova anterior...");
      const processedQuestions = processQuestions(questions, answers);

      if (processedQuestions.length === 0) {
        throw new Error("Nenhuma questão válida encontrada");
      }

      console.log(`Inserindo ${processedQuestions.length} questões...`);
      const { data, error } = await supabase
        .from("questions")
        .insert(processedQuestions)
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${processedQuestions.length} questões foram inseridas com sucesso.`,
      });
      
      setOpen(false);
      setQuestions("");
      setAnswers("");
      setExamYear("");
    } catch (error) {
      console.error("Erro ao inserir questões:", error);
      toast({
        title: "Erro ao inserir questões",
        description: "Ocorreu um erro ao tentar inserir as questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-4">
          Inserir Questões de Provas Anteriores
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inserir Questões de Provas Anteriores</DialogTitle>
          <DialogDescription>
            Insira as questões e o gabarito oficial da prova. Cada questão e resposta deve estar em uma nova linha.
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
            <label htmlFor="questions" className="text-sm font-medium">
              Questões
            </label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Cole aqui o texto das questões, uma por linha..."
              className="min-h-[200px]"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="answers" className="text-sm font-medium">
              Gabarito Oficial
            </label>
            <Textarea
              id="answers"
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              placeholder="Cole aqui o gabarito oficial, uma resposta por linha..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleInsertQuestions}
            disabled={!examYear || !questions.trim() || !answers.trim()}
          >
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};