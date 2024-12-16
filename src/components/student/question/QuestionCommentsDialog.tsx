import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuestionCommentsDialogProps {
  questionId: string;
}

export const QuestionCommentsDialog = ({ questionId }: QuestionCommentsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("Renderizando QuestionCommentsDialog para questão:", questionId);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-16 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comentários dos Alunos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Em breve você poderá ver e adicionar comentários sobre esta questão.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};