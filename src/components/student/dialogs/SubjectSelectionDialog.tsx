import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: questionsCount } = useQuery({
    queryKey: ['questions-count-by-subject'],
    queryFn: async () => {
      console.log("Buscando contagem de questões por matéria...");
      const { data, error } = await supabase
        .from('questions')
        .select('subject, count(*)', { count: 'exact' })
        .eq('status', 'active')
        .group_by('subject');

      if (error) {
        console.error("Erro ao buscar contagem de questões:", error);
        return {};
      }

      console.log("Contagem de questões por matéria:", data);
      return data.reduce((acc, curr) => {
        acc[curr.subject] = curr.count;
        return acc;
      }, {} as Record<string, number>);
    }
  });

  const handleSubjectSelect = (subject: string) => {
    const count = questionsCount?.[subject] || 0;
    
    if (count === 0) {
      toast({
        title: "Desculpe, não há questões disponíveis",
        description: "Estamos trabalhando para adicionar milhares de novas questões. Por favor, tente outra matéria ou volte mais tarde.",
        variant: "destructive"
      });
      return;
    }

    onSubjectSelect(subject);
  };

  return (
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
  );
};