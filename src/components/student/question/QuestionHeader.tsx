import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import SessionStats from "./SessionStats";

interface QuestionHeaderProps {
  isFocusMode: boolean;
  onFocusModeToggle: () => void;
  sessionStats: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
  };
}

const QuestionHeader = ({ 
  isFocusMode, 
  onFocusModeToggle,
  sessionStats 
}: QuestionHeaderProps) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
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
              onClick={() => navigate("/student-dashboard")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Painel do Aluno
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Moon className="h-5 w-5" />
          </Button>
        </div>

        <SessionStats 
          totalQuestions={sessionStats.totalQuestions}
          correctAnswers={sessionStats.correctAnswers}
          wrongAnswers={sessionStats.wrongAnswers}
        />
      </div>
    </Card>
  );
};

export default QuestionHeader;