import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SubjectCard } from "./SubjectCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubjectSelect: (subject: string) => void;
}

export const SubjectSelectionDialog = ({
  open,
  onOpenChange,
  onSubjectSelect,
}: SubjectSelectionDialogProps) => {
  const { toast } = useToast();

  const { data: subjectCounts = {}, isLoading } = useQuery({
    queryKey: ['subject-counts'],
    queryFn: async () => {
      console.log("Buscando contagem de questões por matéria...");
      
      const { data, error } = await supabase
        .from('questions')
        .select('subject')
        .eq('status', 'active')
        .eq('is_from_previous_exam', false); // Apenas questões que não são de concursos anteriores

      if (error) {
        console.error("Erro ao buscar contagem de questões:", error);
        toast({
          title: "Erro ao carregar questões",
          description: "Houve um problema ao buscar as questões. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
        return {};
      }

      const counts = data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.subject] = (acc[curr.subject] || 0) + 1;
        return acc;
      }, {});

      console.log("Contagem de questões por matéria:", counts);
      return counts;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleSubjectSelect = (subject: string) => {
    console.log("Matéria selecionada:", subject);
    const questionCount = subjectCounts[subject] || 0;
    
    if (questionCount === 0) {
      toast({
        title: "Desculpe, não há questões disponíveis",
        description: "Estamos trabalhando para adicionar milhares de novas questões. Por favor, tente outra matéria ou volte mais tarde.",
        variant: "destructive",
      });
      return;
    }

    onSubjectSelect(subject);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Selecione uma Matéria</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-80px)] px-4 pb-4">
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(subjectCounts).map((subject) => (
              <SubjectCard
                key={subject}
                subject={subject}
                questionCount={subjectCounts[subject]}
                onSelect={handleSubjectSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};