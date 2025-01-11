import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import InputMask from 'react-input-mask';
import { MessageSquare, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "+55",
    password: "",
    confirmPassword: "",
  });

  const isValidWhatsApp = (number: string) => {
    const digitsOnly = number.replace(/\D/g, '');
    return digitsOnly.length >= 12; // +55 + DDD + número
  };

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

      if (!isValidWhatsApp(formData.whatsapp)) {
        toast({
          title: "Erro no cadastro",
          description: "Por favor, insira um número de WhatsApp válido.",
          variant: "destructive"
        });
        return;
      }

      // Criar o usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            whatsapp: formData.whatsapp,
            type: 'student'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário na autenticação:', authError);
        throw authError;
      }

      // Criar o registro na tabela students
      const { error: studentError } = await supabase
        .from('students')
        .insert([
          {
            email: formData.email,
            name: formData.name,
            whatsapp: formData.whatsapp,
            status: 'active'
          }
        ]);

      if (studentError) {
        console.error('Erro ao criar registro na tabela students:', studentError);
        throw studentError;
      }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nome completo
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  WhatsApp
                  {isValidWhatsApp(formData.whatsapp) ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-error" />
                  )}
                </label>
                <InputMask
                  mask="+55 (99) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      type="tel"
                      required
                      className="input-field"
                      placeholder="+55 (00) 00000-0000"
                    />
                  )}
                </InputMask>
                <p className="text-xs text-gray-500">
                  Você receberá materiais exclusivos e dicas de estudo via WhatsApp
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Senha</label>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
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
                  className="input-field"
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

        <div className="hidden md:flex flex-col justify-center space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/10">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Por que fornecer seu WhatsApp?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-1" />
                <span>Receba materiais exclusivos de estudo</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-1" />
                <span>Dicas personalizadas baseadas no seu desempenho</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-1" />
                <span>Lembretes de estudo e novidades importantes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-1" />
                <span>Suporte rápido quando precisar de ajuda</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-xl p-6">
            <p className="text-sm text-gray-600 italic">
              "Nossos alunos que ativam as notificações por WhatsApp têm, em média, 
              40% mais engajamento nos estudos e melhores resultados!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;