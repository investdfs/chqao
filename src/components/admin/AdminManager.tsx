import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminList } from "./AdminList";
import { AdminManagerHeader } from "./manager/AdminManagerHeader";
import { useAdminManager } from "./manager/useAdminManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const AdminManager = () => {
  const {
    showAdmins,
    setShowAdmins,
    admins,
    isLoading,
    handleToggleStatus,
    handleAddAdmin
  } = useAdminManager();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <AdminManagerHeader
          showAdmins={showAdmins}
          onToggleView={() => setShowAdmins(!showAdmins)}
          onAddAdmin={handleAddAdmin}
        />
      </CardHeader>
      {showAdmins && (
        <CardContent>
          {admins.length === 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum administrador encontrado. Verifique se você tem as permissões necessárias.
              </AlertDescription>
            </Alert>
          ) : (
            <AdminList admins={admins} onToggleStatus={handleToggleStatus} />
          )}
        </CardContent>
      )}
    </Card>
  );
};