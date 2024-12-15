import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  explanation: string;
}

interface ExamCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  answers: Record<string, string>;
  startTime: Date;
  onFinish: () => void;
}

export function ExamCompletionDialog({
  open,
  onOpenChange,
  questions,
  answers,
  startTime,
  onFinish
}: ExamCompletionDialogProps) {
  const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Ensure startTime is a valid Date object
  const examDuration = startTime instanceof Date && !isNaN(startTime.getTime())
    ? formatDistanceToNow(startTime, { locale: ptBR })
    : "Tempo indisponível";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Resultado da Prova</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Acertos</span>
              <Check className="h-4 w-4 text-success" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-success">{percentage}%</span>
              <p className="text-xs text-muted-foreground">
                {correctAnswers} de {totalQuestions} questões
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Erros</span>
              <X className="h-4 w-4 text-error" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-error">
                {totalQuestions - correctAnswers}
              </span>
              <p className="text-xs text-muted-foreground">questões</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tempo Total</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-primary">{examDuration}</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const isCorrect = answers[question.id] === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? "border-success bg-success/5" : "border-error bg-error/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Questão {index + 1}</span>
                    {isCorrect ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-error" />
                    )}
                  </div>
                  <p className="text-sm mb-2">{question.text}</p>
                  <div className="text-sm">
                    <span className="font-medium">Sua resposta:</span>{" "}
                    {answers[question.id]}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Resposta correta:</span>{" "}
                    {question.correctAnswer}
                  </div>
                  {!isCorrect && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Explicação:</span>{" "}
                      {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-end">
          <Button onClick={onFinish}>Concluir Revisão</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}