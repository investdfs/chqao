import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Iniciando processo de login para:', email);

      // Primeiro, verificar se é um estudante
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

      console.log('Resultado da busca por estudante:', { student, studentError });

      if (studentError) {
        console.error('Erro ao buscar estudante:', studentError);
        toast({
          title: "Erro ao fazer login",
          description: "Ocorreu um erro ao verificar suas credenciais.",
          variant: "destructive",
        });
        return;
      }

      // Se não for estudante, tentar como admin
      if (!student) {
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id, status')
          .eq('email', email)
          .maybeSingle();

        console.log('Resultado da busca por admin:', { admin, adminError });

        if (adminError) {
          console.error('Erro ao buscar admin:', adminError);
          toast({
            title: "Erro ao fazer login",
            description: "Ocorreu um erro ao verificar suas credenciais.",
            variant: "destructive",
          });
          return;
        }

        if (!admin) {
          toast({
            title: "Erro ao fazer login",
            description: "Email ou senha incorretos.",
            variant: "destructive",
          });
          return;
        }

        if (admin.status === 'blocked') {
          toast({
            title: "Acesso bloqueado",
            description: "Sua conta está bloqueada. Entre em contato com um administrador.",
            variant: "destructive",
          });
          return;
        }

        // Verificar senha do admin
        const { data: adminAuth, error: adminAuthError } = await supabase
          .from('admins')
          .select('id')
          .eq('email', email)
          .eq('password', password)
          .maybeSingle();

        if (adminAuthError || !adminAuth) {
          toast({
            title: "Erro ao fazer login",
            description: "Email ou senha incorretos.",
            variant: "destructive",
          });
          return;
        }

        console.log('Login de administrador bem sucedido');
        navigate('/admin-dashboard');
        return;
      }

      if (student.status === 'blocked') {
        toast({
          title: "Acesso bloqueado",
          description: "Sua conta está bloqueada. Entre em contato com um administrador.",
          variant: "destructive",
        });
        return;
      }

      // Verificar senha do estudante
      const { data: studentAuth, error: studentAuthError } = await supabase
        .from('students')
        .select('id')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (studentAuthError || !studentAuth) {
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        return;
      }

      // Verificar sessão do estudante
      try {
        const { data: ipResponse } = await fetch('https://api.ipify.org?format=json')
          .then(res => res.json());
        
        const ip = ipResponse?.ip || 'unknown';
        console.log('IP do usuário:', ip);

        const { data: sessionCheck, error: sessionError } = await supabase
          .rpc('check_and_register_session', {
            p_student_id: student.id,
            p_ip_address: ip
          });

        console.log('Resultado da verificação de sessão:', { sessionCheck, sessionError });

        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          toast({
            title: "Erro ao fazer login",
            description: "Erro ao verificar sessão. Tente novamente mais tarde.",
            variant: "destructive",
          });
          return;
        }

        if (!sessionCheck || sessionCheck.length === 0) {
          toast({
            title: "Erro ao fazer login",
            description: "Erro ao verificar sessão. Tente novamente.",
            variant: "destructive",
          });
          return;
        }

        const [canLogin, message] = Object.values(sessionCheck[0]);

        if (!canLogin) {
          toast({
            title: "Acesso negado",
            description: message,
            variant: "destructive",
          });
          return;
        }

        // Login de estudante bem sucedido
        console.log('Login de estudante bem sucedido');
        navigate('/student-dashboard');

      } catch (error) {
        console.error('Erro ao verificar IP ou sessão:', error);
        toast({
          title: "Erro ao fazer login",
          description: "Erro ao verificar sessão. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin,
  };
};