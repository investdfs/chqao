import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminList } from "./AdminList";
import { AddAdminDialog } from "./AddAdminDialog";
import type { Database } from "@/integrations/supabase/types";

type Admin = Database['public']['Tables']['admins']['Row'];

export const AdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
    
    const channel = supabase
      .channel('admin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admins'
        },
        () => {
          fetchAdmins();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Erro ao carregar administradores",
        description: "Ocorreu um erro ao carregar a lista de administradores.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (adminId: string) => {
    try {
      const admin = admins.find(a => a.id === adminId);
      if (!admin) return;

      const newStatus = admin.status === 'active' ? 'blocked' : 'active';
      
      const { error } = await supabase
        .from('admins')
        .update({ status: newStatus })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do administrador foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do administrador.",
        variant: "destructive"
      });
    }
  };

  const handleAddAdmin = async (email: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ 
          email,
          password: 'admin2300' // Changed from 'default_password' to 'admin2300'
        }]);

      if (error) throw error;

      toast({
        title: "Administrador adicionado",
        description: "O novo administrador foi cadastrado com sucesso.",
      });
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Erro ao adicionar administrador",
        description: "Ocorreu um erro ao cadastrar o novo administrador.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Administradores</span>
          <div className="flex gap-2">
            <AddAdminDialog onAdd={handleAddAdmin} />
            <Button 
              onClick={() => setShowAdmins(!showAdmins)}
              className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showAdmins ? "Ocultar" : "Ver Admins"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showAdmins && (
        <CardContent>
          <AdminList admins={admins} onToggleStatus={handleToggleStatus} />
        </CardContent>
      )}
    </Card>
  );
};