import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Admin = {
  id: string;
  email: string;
  status: 'active' | 'blocked';
};

export const AdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({ email: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admins'
        },
        (payload) => {
          console.log('Change received!', payload);
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

  const handleAddAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .insert([{ email: newAdmin.email }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Administrador adicionado",
        description: "O novo administrador foi cadastrado com sucesso.",
      });

      setNewAdmin({ email: '' });
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Administrador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email" 
                      placeholder="Email do administrador"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-hover text-white"
                    onClick={handleAddAdmin}
                  >
                    Adicionar Administrador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary/80">
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      admin.status === "active"
                        ? "bg-success-light text-success"
                        : "bg-error-light text-error"
                    }`}>
                      {admin.status === "active" ? "Ativo" : "Bloqueado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={admin.status === "active" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(admin.id)}
                      className="w-24"
                    >
                      {admin.status === "active" ? "Bloquear" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};