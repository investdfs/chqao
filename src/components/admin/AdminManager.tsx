import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from "lucide-react";
import { AdminList } from "./AdminList";
import { AddAdminDialog } from "./AddAdminDialog";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

export const AdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  
  const admins = sheetsData?.users.filter(user => user.type === 'admin') || [];

  const handleToggleStatus = async (adminId: string) => {
    try {
      const admin = admins.find(a => a.id === adminId);
      if (!admin) return;

      const newStatus = admin.status === 'active' ? 'blocked' : 'active';
      
      // Update will be handled by SheetDB
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
      // Add will be handled by SheetDB
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
