import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Moon, User, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

interface QuestionHeaderProps {
  isFocusMode: boolean;
  onFocusModeToggle: () => void;
}

const QuestionHeader = ({ isFocusMode, onFocusModeToggle }: QuestionHeaderProps) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Button
            variant={isFocusMode ? "default" : "outline"}
            size="sm"
            onClick={onFocusModeToggle}
            className="flex items-center gap-2"
          >
            {isFocusMode ? (
              <>
                <EyeOff className="h-4 w-4" />
                Desativar Foco
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Ativar Foco
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/student-dashboard")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Painel do Aluno
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionHeader;