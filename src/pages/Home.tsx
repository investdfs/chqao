import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Sistema de Gestão de Questões</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button 
          variant="outline" 
          className="p-6 h-auto text-left flex flex-col items-start"
          onClick={() => navigate("/admin")}
        >
          <span className="text-lg font-semibold mb-2">Área Administrativa</span>
          <span className="text-sm text-muted-foreground">
            Gerencie questões, usuários e visualize estatísticas
          </span>
        </Button>
        
        <Button 
          variant="outline" 
          className="p-6 h-auto text-left flex flex-col items-start"
          onClick={() => navigate("/practice")}
        >
          <span className="text-lg font-semibold mb-2">Praticar Questões</span>
          <span className="text-sm text-muted-foreground">
            Acesse questões para estudo e pratique
          </span>
        </Button>
      </div>
    </div>
  );
}