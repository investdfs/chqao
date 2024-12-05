import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AddAdminDialog } from "../AddAdminDialog";

interface AdminManagerHeaderProps {
  showAdmins: boolean;
  onToggleView: () => void;
  onAddAdmin: (email: string, name: string) => Promise<void>;
}

export const AdminManagerHeader = ({
  showAdmins,
  onToggleView,
  onAddAdmin,
}: AdminManagerHeaderProps) => {
  return (
    <CardTitle className="flex items-center justify-between">
      <span>Gerenciar Administradores</span>
      <div className="flex gap-2">
        <AddAdminDialog onAdd={onAddAdmin} />
        <Button 
          onClick={onToggleView}
          className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {showAdmins ? "Ocultar" : "Ver Admins"}
        </Button>
      </div>
    </CardTitle>
  );
};