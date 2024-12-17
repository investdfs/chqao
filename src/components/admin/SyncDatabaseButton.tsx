import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const SyncDatabaseButton = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSyncDatabase = async () => {
    try {
      console.log('Iniciando atualização geral dos dados...');
      
      // Lista de todas as queries que precisam ser atualizadas
      const queriesToRefetch = [
        'users',              // Usuários (admins e alunos)
        'questions-stats',    // Estatísticas de questões
        'subjects-stats',     // Estatísticas de matérias
        'questions-tree-stats', // Árvore de questões
        'uploaded-pdfs',      // PDFs carregados
        'active-questions-count', // Contador de questões ativas
        'previous-exams-stats', // Estatísticas de provas anteriores
        'subject-questions-count', // Contador por matéria
      ];

      // Atualiza todas as queries em paralelo
      await Promise.all(
        queriesToRefetch.map(queryKey => {
          console.log(`Atualizando dados de: ${queryKey}`);
          return queryClient.refetchQueries({ 
            queryKey: [queryKey],
            type: 'all', // Força atualização mesmo se os dados forem recentes
            exact: false // Atualiza todas as queries que começam com esse prefixo
          });
        })
      );

      // Invalida o cache de todas as queries relacionadas a questões
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0].toString().includes('question')
      });
      
      console.log('Todas as queries foram atualizadas com sucesso');
      
      toast({
        title: "Dados atualizados",
        description: "Todas as informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro ao atualizar os dados. Tente novamente.",
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