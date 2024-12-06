import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, User, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAutoAnswer } from "@/features/questions/hooks/useAutoAnswer";

const QuestionHeader = () => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { isAutoAnswerEnabled, toggleAutoAnswer } = useAutoAnswer();

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/student-dashboard")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Painel do Aluno
          </Button>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-answer"
              checked={isAutoAnswerEnabled}
              onCheckedChange={toggleAutoAnswer}
            />
            <Label htmlFor="auto-answer" className="flex items-center gap-2 cursor-pointer">
              <Zap className="h-4 w-4" />
              Responder automaticamente
            </Label>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Moon className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default QuestionHeader;