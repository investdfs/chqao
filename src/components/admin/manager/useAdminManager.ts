import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

export const useAdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  
  const admins = sheetsData?.users.filter(user => user.type === 'admin') || [];

  const handleToggleStatus = async (adminId: string) => {
    try {
      const admin = admins.find(a => a.id === adminId);
      if (!admin) return;

      const newStatus = admin.status === 'active' ? 'blocked' : 'active';
      
      console.log('Updating admin status:', { adminId, newStatus });
      
      // Check if admin exists first using maybeSingle()
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', adminId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking admin existence:', checkError);
        throw checkError;
      }

      if (!existingAdmin) {
        toast({
          title: "Erro ao atualizar status",
          description: "Administrador não encontrado.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('admins')
        .update({ status: newStatus })
        .eq('id', adminId);

      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: "O status do administrador foi atualizado com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do administrador.",
        variant: "destructive"
      });
    }
  };

  const handleAddAdmin = async (email: string, name: string) => {
    try {
      console.log('Adding new admin:', { email, name });
      
      // Check if admin already exists
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking admin existence:', checkError);
        throw checkError;
      }

      if (existingAdmin) {
        toast({
          title: "Erro ao adicionar administrador",
          description: "Já existe um administrador com este email.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('admins')
        .insert([{ 
          email, 
          name,
          password: Math.random().toString(36).slice(-8),
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Administrador adicionado",
        description: "O novo administrador foi cadastrado com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Erro ao adicionar administrador",
        description: "Ocorreu um erro ao cadastrar o novo administrador.",
        variant: "destructive"
      });
    }
  };

  return {
    showAdmins,
    setShowAdmins,
    admins,
    isLoading,
    handleToggleStatus,
    handleAddAdmin
  };
};