import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompletionDialog } from "./CompletionDialog";
import { useState } from "react";

interface SubjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubjectSelect: (subject: string) => void;
}

const subjects = [
  "Língua Portuguesa",
  "Geografia do Brasil",
  "História do Brasil",
  "Estatuto dos Militares",
  "Licitações e Contratos",
  "Regulamento de Administração do Exército (RAE)",
  "Direito Militar e Sindicância no Âmbito do Exército Brasileiro",
  "Código Penal Militar",
  "Código de Processo Penal Militar"
];

export const SubjectSelectionDialog = ({
  open,
  onOpenChange,
  onSubjectSelect
}: SubjectSelectionDialogProps) => {
  const { toast } = useToast();
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("");

  const { data: questionsCount } = useQuery({
    queryKey: ['questions-count-by-subject'],
    queryFn: async () => {
      console.log("Buscando contagem de questões por matéria...");
      
      const { data, error } = await supabase
        .rpc('get_subjects_count');

      if (error) {
        console.error("Erro ao buscar contagem de questões:", error);
        toast({
          title: "Erro ao carregar questões",
          description: "Houve um problema ao buscar as questões. Por favor, tente novamente mais tarde.",
          variant: "destructive",
          className: "bg-white border-red-500"
        });
        return {};
      }

      const counts = data?.reduce((acc: Record<string, number>, curr: { subject: string, count: number }) => {
        acc[curr.subject] = Number(curr.count);
        return acc;
      }, {});

      console.log("Contagem de questões por matéria:", counts);
      return counts || {};
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleSubjectSelect = (subject: string) => {
    const count = questionsCount?.[subject] || 0;
    
    if (count === 0) {
      toast({
        title: "Desculpe, não há questões disponíveis",
        description: "Estamos trabalhando para adicionar milhares de novas questões. Por favor, tente outra matéria ou volte mais tarde.",
        variant: "destructive",
        className: "bg-white border-red-500"
      });
      return;
    }

    setCurrentSubject(subject);
    onSubjectSelect(subject);
  };

  const handleCompletionClose = () => {
    setShowCompletion(false);
    onOpenChange(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Selecione a matéria para estudar
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4">
            <div className="flex flex-col gap-2 p-4">
              {subjects.map((subject, index) => (
                <Button
                  key={subject}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10"
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <span className="mr-2">{index + 1}.</span>
                  {subject}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <CompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        subject={currentSubject}
        onSelectNewSubject={handleCompletionClose}
      />
    </>
  );
};