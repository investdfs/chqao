
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Database } from "lucide-react";
import { verifySupabaseHealth } from "@/utils/supabaseHealthCheck";

export const SupabaseHealthCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  const handleCheckHealth = async () => {
    setIsChecking(true);
    try {
      const result = await verifySupabaseHealth();
      setIsHealthy(result);
    } finally {
      setIsChecking(false);
      setLastCheck(new Date());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status do Supabase
        </CardTitle>
        <CardDescription>
          Verifique a conexão e integridade do banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={handleCheckHealth} 
            disabled={isChecking}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Conexão"
            )}
          </Button>

          {lastCheck && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Último check:</span>
                {isHealthy !== null && (
                  <CheckCircle2 className={`h-4 w-4 ${isHealthy ? 'text-green-500' : 'text-red-500'}`} />
                )}
              </div>
              <span>
                {lastCheck.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
