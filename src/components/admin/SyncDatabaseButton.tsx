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

      // Atualiza todas as queries em paralelo com timeout
      await Promise.all(
        queriesToRefetch.map(async queryKey => {
          console.log(`Atualizando dados de: ${queryKey}`);
          try {
            // Adiciona um timeout de 10 segundos para cada requisição
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Timeout')), 10000);
            });

            await Promise.race([
              queryClient.refetchQueries({ 
                queryKey: [queryKey],
                type: 'all',
                exact: false
              }),
              timeoutPromise
            ]);
          } catch (error) {
            console.error(`Erro ao atualizar ${queryKey}:`, error);
            throw new Error(`Falha ao atualizar ${queryKey}`);
          }
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
      
      // Mensagem de erro mais detalhada para o usuário
      toast({
        title: "Erro na atualização",
        description: "Ocorreu um erro de conexão com o servidor. Por favor, verifique sua conexão e tente novamente em alguns instantes.",
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