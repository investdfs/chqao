import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BlockedUserCard = () => {
  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6 text-center">
          <div className="text-lg font-medium text-red-600 dark:text-red-400">
            Usuário bloqueado
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Entre em contato com o administrador para mais informações
          </p>
          <Button
            className="w-full sm:w-auto"
            onClick={() => window.open("https://wa.me/5532988847713", "_blank")}
          >
            Contatar Administrador
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedUserCard;