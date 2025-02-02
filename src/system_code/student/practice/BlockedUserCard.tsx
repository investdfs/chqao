import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";

const BlockedUserCard = () => {
  return (
    <Card className="bg-red-50 border-red-500">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <AlertOctagon className="h-12 w-12 text-red-500" />
          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Acesso Bloqueado
            </h2>
            <p className="text-red-600">
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