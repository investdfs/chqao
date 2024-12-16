import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Bookmark, Pencil, BarChart3, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { QuestionStatsDialog } from "./QuestionStatsDialog";

interface QuestionFooterProps {
  questionId: string;
  correctAnswer: string;
}

export const QuestionFooter = ({ questionId, correctAnswer }: QuestionFooterProps) => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleBookmark = () => {
    toast({
      title: "Questão salva!",
      description: "Esta questão foi adicionada aos seus marcadores.",
    });
    setOpenDialog(null);
  };

  return (
    <>
      <div className="flex justify-center gap-4 mt-6 pb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setOpenDialog("comments")}
        >
          <MessageSquare className="h-4 w-4" />
          Comentários
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setOpenDialog("bookmarks")}
        >
          <Bookmark className="h-4 w-4" />
          Marcadores
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setOpenDialog("notes")}
        >
          <Pencil className="h-4 w-4" />
          Anotações
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setOpenDialog("stats")}
        >
          <BarChart3 className="h-4 w-4" />
          Estatísticas
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-error hover:text-error"
          onClick={() => setOpenDialog("report")}
        >
          <AlertTriangle className="h-4 w-4" />
          Reportar Erro
        </Button>
      </div>

      {/* Diálogo de Comentários */}
      <Dialog open={openDialog === "comments"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comentários</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Em breve você poderá discutir esta questão com outros estudantes!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Marcadores */}
      <Dialog open={openDialog === "bookmarks"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Questão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Button onClick={handleBookmark} className="w-full">
              Adicionar aos Marcadores
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Anotações */}
      <Dialog open={openDialog === "notes"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anotações</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Em breve você poderá fazer anotações sobre esta questão!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Estatísticas */}
      {openDialog === "stats" && (
        <QuestionStatsDialog
          open={true}
          onOpenChange={() => setOpenDialog(null)}
          questionId={questionId}
          correctAnswer={correctAnswer}
        />
      )}

      {/* Diálogo de Reportar Erro */}
      <Dialog open={openDialog === "report"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar Erro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Em breve você poderá reportar erros nas questões!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};