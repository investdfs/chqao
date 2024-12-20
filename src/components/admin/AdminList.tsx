import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "@/hooks/useGoogleSheetsData";

interface AdminListProps {
  admins: User[];
  onToggleStatus: (adminId: string) => void;
}

export const AdminList = ({ admins, onToggleStatus }: AdminListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary hover:bg-secondary/80">
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Senha</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{admin.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{admin.password}</TableCell>
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