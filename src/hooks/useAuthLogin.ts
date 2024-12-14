import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  email: string;
  password: string;
}

const isPreviewMode = window.location.hostname === 'preview.lovable.dev';

export const useAuthLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: LoginFormData, isAdmin: boolean) => {
    // Se estiver no modo preview, redireciona direto sem autenticação
    if (isPreviewMode) {
      console.log("Preview mode: bypassing authentication");
      navigate(isAdmin ? "/admin-dashboard" : "/student-dashboard");
      return;
    }

    setLoading(true);
    const normalizedEmail = formData.email.toLowerCase().trim();
    
    try {
      console.log("Iniciando processo de login para:", normalizedEmail);

      // Verifica se o usuário existe na tabela correta
      const { data: existingUser, error: queryError } = await supabase
        .from(isAdmin ? 'admins' : 'students')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('password', formData.password)
        .single();

      console.log("Resultado da busca do usuário:", { existingUser, queryError });

      if (queryError || !existingUser) {
        console.log("Usuário não encontrado ou senha incorreta");
        toast({
          title: "Acesso negado",
          description: isAdmin ? "Credenciais de administrador inválidas." : "Email ou senha incorretos.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (existingUser.status === 'blocked') {
        console.log("Usuário bloqueado:", existingUser);
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

      // Se não estiver em modo preview, tenta fazer login no Supabase Auth
      if (!isPreviewMode) {
        console.log("Tentando fazer login no Supabase Auth...");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: formData.password,
        });

        if (signInError) {
          console.error('Erro no login:', signInError);
          throw signInError;
        }
      }

      console.log("Login realizado com sucesso!");
      toast({
        title: "Login realizado com sucesso!",
        description: isAdmin ? "Bem-vindo, Administrador!" : "Bem-vindo ao CHQAO!",
      });

      navigate(isAdmin ? "/admin-dashboard" : "/student-dashboard", {
        state: { userStatus: existingUser.status }
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
    loading
  };
};