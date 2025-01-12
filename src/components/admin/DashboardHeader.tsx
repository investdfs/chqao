import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-[#1A1F2C] to-[#403E43] p-6 rounded-lg shadow-lg">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">CHQAO</h1>
        <p className="text-gray-300 text-sm">Painel Administrativo</p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="bg-white/10 text-white hover:bg-white/20 border-white/20 gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </header>
  );
};