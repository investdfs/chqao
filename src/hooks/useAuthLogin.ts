import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

interface LoginFormData {
  email: string;
  password: string;
}

export const useAuthLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: sheetsData, isLoading: isLoadingData } = useGoogleSheetsData();

  const handleLogin = async (formData: LoginFormData, isAdmin: boolean) => {
    setLoading(true);
    const normalizedEmail = formData.email.toLowerCase().trim();
    
    try {
      if (!sheetsData?.users) {
        throw new Error('Erro ao carregar dados dos usuários');
      }

      console.log("Verificando usuário na planilha...");
      const user = sheetsData.users.find(
        (u: any) => 
          u.email === normalizedEmail && 
          u.password === formData.password &&
          u.type === (isAdmin ? 'admin' : 'student')
      );

      if (!user) {
        toast({
          title: "Acesso negado",
          description: isAdmin ? "Credenciais de administrador inválidas." : "Email ou senha incorretos.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (user.status === 'blocked') {
        toast({
          title: "Acesso bloqueado",
          description: isAdmin 
            ? "Sua conta de administrador está bloqueada."
            : "Sua conta está bloqueada. Entre em contato com o suporte.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log("Usuário encontrado na planilha, atualizando/criando registro...");
      if (!isAdmin) {
        const { error: upsertError } = await supabase
          .from('students')
          .upsert({
            email: normalizedEmail,
            name: user.name || '',
            password: formData.password,
            status: user.status || 'active'
          }, {
            onConflict: 'email'
          });

        if (upsertError) {
          console.error('Erro ao atualizar dados do estudante:', upsertError);
          throw new Error('Erro ao atualizar dados do estudante');
        }
      }

      console.log("Tentando fazer login no Supabase...");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: formData.password,
      });

      if (signInError) {
        console.log('Erro no login:', signInError);
        
        if (signInError.message.includes('Email not confirmed')) {
          console.log("Email não confirmado, tentando criar usuário...");
          const { error: signUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: formData.password,
            options: {
              data: {
                is_admin: isAdmin
              }
            }
          });

          if (signUpError) {
            console.error('Erro ao criar usuário:', signUpError);
            throw new Error('Erro ao criar usuário');
          }

          console.log("Usuário criado, tentando login novamente...");
          const { error: finalSignInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: formData.password,
          });

          if (finalSignInError) {
            console.error('Erro no login final:', finalSignInError);
            throw new Error('Erro ao fazer login após criar usuário');
          }
        } else {
          throw signInError;
        }
      }

      toast({
        title: "Login realizado com sucesso!",
        description: isAdmin ? "Bem-vindo, Administrador!" : "Bem-vindo ao CHQAO!",
      });

      navigate(isAdmin ? "/admin-dashboard" : "/student-dashboard", {
        state: { userStatus: user.status }
      });
    } catch (error: any) {
      console.error('Error during login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    isLoadingData
  };
};