import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddAdminDialogProps {
  onAdd: (email: string) => void;
}

export const AddAdminDialog = ({ onAdd }: AddAdminDialogProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onAdd(email);
    setEmail('');
  };

  return (
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary-hover text-white"
            onClick={handleSubmit}
          >
            Adicionar Administrador
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};