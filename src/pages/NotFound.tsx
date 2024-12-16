import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button onClick={() => navigate("/")}>
        Voltar para a página inicial
      </Button>
    </div>
  );
}