import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

interface QuestionHeaderProps {
  isFocusMode: boolean;
  onFocusModeToggle: () => void;
  sessionStats?: {
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

  const calculatePercentage = () => {
    if (!sessionStats || sessionStats.totalQuestions === 0) return 0;
    return Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100);
  };

  const percentage = calculatePercentage();

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex flex-col gap-4">
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

        {sessionStats && (
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="px-4 py-2 rounded-lg border bg-white/50 dark:bg-gray-800/50">
              <span className="font-semibold">Questões:</span> {sessionStats.totalQuestions}
            </div>
            <div className="px-4 py-2 rounded-lg border bg-white/50 dark:bg-gray-800/50">
              <span className="font-semibold">Acertos:</span>{' '}
              <span className="text-green-600 dark:text-green-400 font-bold">
                {sessionStats.correctAnswers}
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg border bg-white/50 dark:bg-gray-800/50">
              <span className="font-semibold">Erros:</span>{' '}
              <span className="text-red-600 dark:text-red-400 font-bold">
                {sessionStats.wrongAnswers}
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg border bg-white/50 dark:bg-gray-800/50">
              <span className="font-semibold">Aproveitamento:</span>{' '}
              <span className={`font-bold ${percentage >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentage}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionHeader;