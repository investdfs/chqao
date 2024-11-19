import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { syncNewData } from "@/utils/syncUtils";

interface SyncDatabaseButtonProps {
  onRefetch: () => Promise<void>;
}

export const SyncDatabaseButton = ({ onRefetch }: SyncDatabaseButtonProps) => {
  const { toast } = useToast();

  const handleSyncDatabase = async () => {
    try {
      console.log('Iniciando processo de sincronização...');
      
      // Executa o refetch existente
      await onRefetch();
      console.log('Refetch concluído');

      // Sincroniza novos dados
      await syncNewData();

      toast({
        title: "Sincronização concluída",
        description: "O banco de dados foi atualizado com os novos dados com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao sincronizar banco de dados:', error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar o banco de dados.",
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
      Sincronizar Banco de Dados
    </Button>
  );
};