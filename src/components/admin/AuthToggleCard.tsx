import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/use-toast";
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
import { useState } from "react";
import { showSuccess, showWarning } from "@/components/ui/notification";

export const AuthToggleCard = () => {
  const { authRequired, toggleAuth } = useAuthStore();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleToggleRequest = () => {
    if (authRequired) {
      setShowConfirmDialog(true);
    } else {
      handleToggle();
    }
  };

  const handleToggle = () => {
    toggleAuth();
    setShowConfirmDialog(false);
    
    if (authRequired) {
      showWarning(
        "Autenticação desativada",
        "Os alunos agora podem acessar o sistema sem login"
      );
    } else {
      showSuccess(
        "Autenticação ativada",
        "Os alunos agora precisam fazer login para acessar o sistema"
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Controle de Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Switch
              id="auth-toggle"
              checked={authRequired}
              onCheckedChange={handleToggleRequest}
            />
            <Label htmlFor="auth-toggle">
              {authRequired 
                ? "Autenticação obrigatória ativada" 
                : "Autenticação obrigatória desativada"}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {authRequired 
              ? "Os alunos precisam fazer login para acessar o sistema" 
              : "Os alunos podem acessar o sistema sem fazer login"}
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Atenção! Desativar autenticação?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ao desativar a autenticação obrigatória, qualquer pessoa poderá acessar o sistema sem fazer login.
              Isso pode comprometer a segurança e o controle de acesso do sistema.
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, desativar autenticação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
