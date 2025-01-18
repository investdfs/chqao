import * as React from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"

export function NotificationDemo() {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border-l-4 border-primary p-4 bg-primary-light/10">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <h3 className="font-medium text-primary">
            Comece sua jornada de estudos
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Acesse agora nossa plataforma e comece a estudar
          </p>
        </div>
        <Button
          onClick={() => navigate("/register")}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          Começar Agora
        </Button>
      </div>
    </div>
  )
}