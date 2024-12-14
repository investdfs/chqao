import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/use-toast";

export const AuthToggleCard = () => {
  const { authRequired, toggleAuth } = useAuthStore();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleAuth();
    toast({
      title: authRequired ? "Autenticação desativada" : "Autenticação ativada",
      description: authRequired 
        ? "Os alunos agora podem acessar o sistema sem login" 
        : "Os alunos agora precisam fazer login para acessar o sistema",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Autenticação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Switch
            id="auth-toggle"
            checked={authRequired}
            onCheckedChange={handleToggle}
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
  );
};