import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminManager = () => {
  const { toast } = useToast();
  const [showAdmins, setShowAdmins] = useState(false);
  const [admins, setAdmins] = useState(() => {
    const savedAdmins = localStorage.getItem('admins');
    return savedAdmins ? JSON.parse(savedAdmins) : [
      { id: 1, email: 'willsttar@gmail.com', password: '212300', status: 'active' }
    ];
  });
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

  const handleToggleStatus = (adminId: number) => {
    setAdmins(prevAdmins =>
      prevAdmins.map(admin =>
        admin.id === adminId
          ? { ...admin, status: admin.status === "active" ? "blocked" : "active" }
          : admin
      )
    );
    localStorage.setItem('admins', JSON.stringify(admins));
    toast({
      title: "Status atualizado",
      description: "O status do administrador foi atualizado com sucesso.",
    });
  };

  const handleAddAdmin = () => {
    const newAdminData = {
      id: Date.now(),
      ...newAdmin,
      status: "active"
    };
    
    const updatedAdmins = [...admins, newAdminData];
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    toast({
      title: "Administrador adicionado",
      description: "O novo administrador foi cadastrado com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Administradores</span>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Administrador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label>Email</label>
                    <Input 
                      type="email" 
                      placeholder="Email do administrador"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Senha</label>
                    <Input 
                      type="password" 
                      placeholder="Senha"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddAdmin}>
                    Adicionar Administrador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setShowAdmins(!showAdmins)}>
              <Eye className="h-4 w-4 mr-2" />
              {showAdmins ? "Ocultar" : "Ver Admins"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showAdmins && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {admin.status === "active" ? "Ativo" : "Bloqueado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(admin.id)}
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