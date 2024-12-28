import { AddAdminDialog } from "../AddAdminDialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AdminManagerHeaderProps {
  showAdmins: boolean;
  onToggleView: () => void;
  onAddAdmin: (email: string, name: string, password: string) => void;
}

export const AdminManagerHeader = ({
  showAdmins,
  onToggleView,
  onAddAdmin,
}: AdminManagerHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Administradores</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleView}
          className="h-8 w-8"
        >
          {showAdmins ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <AddAdminDialog onAdd={onAddAdmin} />
    </div>
  );
};