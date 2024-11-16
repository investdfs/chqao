import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = formData.email.toLowerCase().trim();
    console.log('Attempting login with email:', normalizedEmail);

    try {
      if (isAdmin) {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('email', normalizedEmail)
          .eq('password', formData.password)
          .single();

        console.log('Admin login attempt result:', { data: adminData, error: adminError });

        if (adminError || !adminData) {
          toast({
            title: "Acesso negado",
            description: "Credenciais de administrador inválidas.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (adminData.status === 'blocked') {
          toast({
            title: "Acesso bloqueado",
            description: "Sua conta de administrador está bloqueada.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo, Administrador!",
        });
        navigate("/admin-dashboard");
        return;
      }

      // Student login
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('password', formData.password)
        .single();

      console.log('Student login attempt result:', { data: studentData, error: studentError });

      if (studentError || !studentData) {
        toast({
          title: "Usuário não encontrado",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (studentData.status === 'blocked') {
        toast({
          title: "Acesso bloqueado",
          description: "Sua conta está bloqueada. Entre em contato com o suporte.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao CHQAO!",
      });

      navigate("/student-dashboard", { 
        state: { userStatus: studentData.status }
      });
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-mode"
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
              />
              <Label htmlFor="admin-mode">Logar como Administrador</Label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          {!isAdmin && (
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-primary hover:underline"
                >
                  Registre-se
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;