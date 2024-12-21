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
  const [updates] = React.useState<Update[]>([
    {
      id: "1",
      timestamp: "2024-03-19 10:00:00",
      changes: "Importação inicial de questões",
    },
    // More updates will be added dynamically
  ]);

  const handleRestore = async (updateId: string) => {
    console.log("Tentando restaurar versão:", updateId);
    
    try {
      // TODO: Implement restore logic
      toast({
        title: "Restauração em desenvolvimento",
        description: "Esta funcionalidade será implementada em breve.",
      });
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