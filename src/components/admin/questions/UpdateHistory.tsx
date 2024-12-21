import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Update {
  id: string;
  timestamp: string;
  changes: string;
}

export const UpdateHistory = () => {
  const { toast } = useToast();
  const [updates, setUpdates] = React.useState<Update[]>([]);

  React.useEffect(() => {
    fetchUpdateHistory();
  }, []);

  const fetchUpdateHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('update_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUpdates = data.map(update => ({
        id: update.id,
        timestamp: update.created_at,
        changes: formatChanges(update.type, update.changes),
      }));

      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de atualizações.",
        variant: "destructive",
      });
    }
  };

  const formatChanges = (type: string, changes: any): string => {
    switch (type) {
      case 'exam_reset':
        return `Reset de provas - Ano: ${changes.year}${changes.subject !== 'all' ? `, Matéria: ${changes.subject}` : ''}`;
      case 'question_insert':
        return `Inserção de ${changes.count || 1} questão(ões)`;
      case 'question_update':
        return `Atualização de questão`;
      case 'question_delete':
        return `Exclusão de questão`;
      default:
        return 'Atualização no banco de questões';
    }
  };

  const handleRestore = async (updateId: string) => {
    console.log("Tentando restaurar versão:", updateId);
    
    try {
      const { data: updateData, error: updateError } = await supabase
        .from('update_history')
        .select('*')
        .eq('id', updateId)
        .single();

      if (updateError) throw updateError;

      if (updateData.type === 'exam_reset') {
        // Implement restore logic based on the update type
        toast({
          title: "Restauração em desenvolvimento",
          description: "Esta funcionalidade será implementada em breve.",
        });
      }
    } catch (error) {
      console.error("Erro ao restaurar versão:", error);
      toast({
        title: "Erro ao restaurar",
        description: "Não foi possível restaurar a versão selecionada.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Atualizações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Histórico de Atualizações</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="border p-4 rounded-lg space-y-2 bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                    <p className="font-medium">{update.changes}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleRestore(update.id)}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restaurar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};