import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

interface SyncDatabaseButtonProps {
  onRefetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

export const SyncDatabaseButton = ({ onRefetch }: SyncDatabaseButtonProps) => {
  const { toast } = useToast();

  const handleSyncDatabase = async () => {
    try {
      console.log('Iniciando atualização dos dados...');
      await onRefetch();
      
      toast({
        title: "Dados atualizados",
        description: "Os dados foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro ao atualizar os dados.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleSyncDatabase}
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Atualizar Dados
    </Button>
  );
};