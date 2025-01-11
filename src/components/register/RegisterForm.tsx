import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputMask from 'react-input-mask';
import { MessageSquare, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "+55",
    password: "",
    confirmPassword: "",
  });

  const isValidWhatsApp = (number: string) => {
    const digitsOnly = number.replace(/\D/g, '');
    return digitsOnly.length >= 12;
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

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          email: formData.email,
          name: formData.name,
          whatsapp: formData.whatsapp,
          password: formData.password,
          status: 'active'
        });

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
    <Card className="w-full lg:max-w-md">
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
  );
};

export default RegisterForm;