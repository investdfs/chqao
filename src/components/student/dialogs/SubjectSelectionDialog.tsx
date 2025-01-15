import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SubjectCard } from "./SubjectCard";

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
        .eq('status', 'active');

      if (error) {
        console.error("Erro ao buscar contagem de questões:", error);
        toast({
          title: "Erro ao carregar questões",
          description: "Houve um problema ao buscar as questões. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
        return {};
      }

      // Agrupa as contagens por matéria
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione uma Matéria</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(subjectCounts).map((subject) => (
            <SubjectCard
              key={subject}
              subject={subject}
              questionCount={subjectCounts[subject]}
              onSelect={handleSubjectSelect}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
