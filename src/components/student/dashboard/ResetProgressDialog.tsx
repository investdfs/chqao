import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ResetProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResetProgressDialog = ({ open, onOpenChange }: ResetProgressDialogProps) => {
  const [countdown, setCountdown] = useState(10);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
      setCountdown(10);
    };
  }, [open]);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase.rpc('reset_student_progress', {
        student_id_param: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Progresso resetado com sucesso!",
        description: "Seu dashboard foi reiniciado. Todas as estatísticas foram zeradas.",
      });

      // Recarrega a página para atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error("Erro ao resetar progresso:", error);
      toast({
        title: "Erro ao resetar progresso",
        description: "Ocorreu um erro ao tentar resetar seu progresso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-red-500">
            ⚠️ Atenção! Esta ação é irreversível!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="text-base font-semibold">
              Você está prestes a apagar TODO seu progresso:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Histórico de questões respondidas</li>
              <li>Dias de estudo consecutivos</li>
              <li>Tempo total de estudo</li>
              <li>Estatísticas de desempenho</li>
              <li>Progresso no conteúdo</li>
            </ul>
            <p className="text-sm font-medium mt-4">
              Sua conta permanecerá ativa, mas você voltará ao estado inicial como se nunca tivesse estudado.
            </p>
            <div className="text-center mt-4">
              <span className="text-2xl font-bold text-red-500">
                {countdown}
              </span>
              <p className="text-sm text-muted-foreground">
                segundos restantes para confirmar
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResetting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={countdown > 0 || isResetting}
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600"
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetando...
              </>
            ) : (
              "Confirmar Reset"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};