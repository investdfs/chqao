import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      // Check if it's an admin
      const savedAdmins = localStorage.getItem('admins');
      const admins = savedAdmins ? JSON.parse(savedAdmins) : [];
      const adminUser = admins.find((admin: any) => 
        admin.email === formData.email && 
        admin.password === formData.password &&
        admin.status === "active"
      );

      if (adminUser) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo, Administrador!",
        });
        navigate("/admin-dashboard");
        return;
      }

      // Check if it's a student
      const savedStudents = localStorage.getItem('students');
      const students = savedStudents ? JSON.parse(savedStudents) : [];
      const studentUser = students.find((student: any) => 
        student.email === formData.email && 
        student.password === formData.password
      );

      if (!studentUser) {
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

      navigate("/student-dashboard", { 
        state: { userStatus: studentUser.status }
      });
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