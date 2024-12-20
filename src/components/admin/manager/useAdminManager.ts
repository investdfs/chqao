import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  
  const { data: admins = [], isLoading, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admin data...');
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, name, status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      return data;
    }
  });

  const handleToggleStatus = async (adminId: string) => {
    try {
      const admin = admins.find(a => a.id === adminId);
      if (!admin) return;

      const newStatus = admin.status === 'active' ? 'blocked' : 'active';
      
      console.log('Updating admin status:', { adminId, newStatus });
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