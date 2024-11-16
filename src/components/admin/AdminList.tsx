import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Admin = Database['public']['Tables']['admins']['Row'];

interface AdminListProps {
  admins: Admin[];
  onToggleStatus: (adminId: string) => void;
}

export const AdminList = ({ admins, onToggleStatus }: AdminListProps) => {
  return (
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
                onClick={() => onToggleStatus(admin.id)}
                className="w-24"
              >
                {admin.status === "active" ? "Bloquear" : "Ativar"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};