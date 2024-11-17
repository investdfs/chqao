import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeSelector } from "@/components/ThemeSelector";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-primary">CHQAO - Painel Administrativo</h1>
      <div className="flex items-center gap-4">
        <ThemeSelector />
        <Button variant="outline" onClick={() => navigate("/")}>
          Sair
        </Button>
      </div>
    </header>
  );
};