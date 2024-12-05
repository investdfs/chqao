import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminList } from "./AdminList";
import { AdminManagerHeader } from "./manager/AdminManagerHeader";
import { useAdminManager } from "./manager/useAdminManager";

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
          <AdminList admins={admins} onToggleStatus={handleToggleStatus} />
        </CardContent>
      )}
    </Card>
  );
};