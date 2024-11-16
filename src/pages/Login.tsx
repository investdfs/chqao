import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - In a real app this would come from your backend
const registeredUsers = [
  { 
    email: "joao@email.com",
    password: "123456",
    status: "active"
  },
  { 
    email: "maria@email.com",
    password: "654321",
    status: "blocked"
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find user in registered users
      const user = registeredUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        toast({
          title: "Usuário não encontrado",
          description: "Por favor, registre-se primeiro para acessar o sistema.",
          variant: "destructive"
        });
        navigate("/register");
        return;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao CHQAO!",
      });

      // If user is admin, redirect to admin dashboard
      if (formData.email === "admin" && formData.password === "admin") {
        navigate("/admin-dashboard");
      } else {
        // For regular users, redirect to student dashboard
        navigate("/student-dashboard", { 
          state: { userStatus: user.status }
        });
      }
    } catch (error) {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;