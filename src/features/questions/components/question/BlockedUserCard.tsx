import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const BlockedUserCard = () => {
  return (
    <Card className="bg-error-light border-error">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-12 w-12 text-error" />
          <div>
            <h2 className="text-xl font-semibold text-error mb-2">
              Acesso Bloqueado
            </h2>
            <p className="text-gray-600">
              Sua conta está temporariamente bloqueada. Entre em contato com o
              suporte para mais informações.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedUserCard;