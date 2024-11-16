import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-primary">CHQAO - Painel Administrativo</h1>
      <Button variant="outline" onClick={() => navigate("/")}>
        Sair
      </Button>
    </header>
  );
};