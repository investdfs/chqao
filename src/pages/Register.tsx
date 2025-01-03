import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro no cadastro",
          description: "As senhas não coincidem.",
          variant: "destructive"
        });
        return;
      }

      // Primeiro, verificar se o usuário já existe
      const { data: existingUsers, error: queryError } = await supabase
        .from('students')
        .select('id')
        .eq('email', formData.email);

      console.log('Verificando usuário existente:', { existingUsers, queryError });

      if (queryError) {
        console.error('Erro ao verificar usuário existente:', queryError);
        throw queryError;
      }

      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Erro no cadastro",
          description: "Este email já está cadastrado. Por favor, faça login ou use outro email.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('Iniciando registro do estudante:', { email: formData.email, name: formData.name });

      // Criar o usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            type: 'student'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário na autenticação:', authError);
        if (authError.message.includes("already registered")) {
          toast({
            title: "Erro no cadastro",
            description: "Este email já está cadastrado. Por favor, faça login ou use outro email.",
            variant: "destructive"
          });
        } else {
          throw authError;
        }
        return;
      }

      console.log('Usuário criado na autenticação:', authData);

      // Criar o registro na tabela students
      const { error: studentError } = await supabase
        .from('students')
        .insert([
          {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            status: 'active'
          }
        ]);

      if (studentError) {
        console.error('Erro ao criar registro na tabela students:', studentError);
        throw studentError;
      }

      console.log('Registro criado com sucesso na tabela students');

      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login na plataforma.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error('Erro durante o registro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome completo</label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmar senha
              </label>
              <Input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;