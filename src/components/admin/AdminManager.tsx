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
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-4">
          <AdminManagerHeader
            showAdmins={showAdmins}
            onToggleView={() => setShowAdmins(!showAdmins)}
            onAddAdmin={handleAddAdmin}
          />
        </CardHeader>
        <CardContent>
          <div>Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <AdminManagerHeader
          showAdmins={showAdmins}
          onToggleView={() => setShowAdmins(!showAdmins)}
          onAddAdmin={handleAddAdmin}
        />
      </CardHeader>
      <CardContent>
        {showAdmins ? (
          admins.length === 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum administrador encontrado. Verifique se você tem as permissões necessárias.
              </AlertDescription>
            </Alert>
          ) : (
            <AdminList admins={admins} onToggleStatus={handleToggleStatus} />
          )
        ) : (
          <Alert>
            <AlertDescription>
              Clique no botão acima para visualizar a lista de administradores.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};