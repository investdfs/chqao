import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResetProgressButton } from "./components/ResetProgressButton";
import { SubjectsPanel } from "./components/SubjectsPanel";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold gradient-text">
          CHQAO - Estude Praticando
        </h1>
        <div className="flex items-center gap-4">
          <SubjectsPanel />
          <ResetProgressButton />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="hover:bg-primary-light/50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};