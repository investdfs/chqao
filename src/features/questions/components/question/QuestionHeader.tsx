import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Moon, User, ArrowLeft, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useExamMode } from "../../contexts/ExamModeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionHeaderProps {
  isFocusMode: boolean;
  onFocusModeToggle: () => void;
}

const QuestionHeader = ({ isFocusMode, onFocusModeToggle }: QuestionHeaderProps) => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { isExamMode, toggleExamMode } = useExamMode();
  const [showExamModeDialog, setShowExamModeDialog] = useState(false);

  const handleExamModeToggle = () => {
    if (!isExamMode) {
      setShowExamModeDialog(true);
    } else {
      toggleExamMode();
    }
  };

  const confirmExamMode = () => {
    toggleExamMode();
    setShowExamModeDialog(false);
  };

  return (
    <>
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/previous-exams")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Modos de Estudo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={handleExamModeToggle} className="flex items-center gap-2">
                  {isExamMode ? "Desativar" : "Ativar"} Modo Prova
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFocusModeToggle} className="flex items-center gap-2">
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
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

      <Dialog open={showExamModeDialog} onOpenChange={setShowExamModeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ativar Modo Prova</DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <p>
                No Modo Prova, você terá uma experiência similar a um exame real:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>As respostas corretas só serão mostradas ao final</li>
                <li>Não será possível voltar para questões anteriores</li>
                <li>O tempo de prova será cronometrado</li>
                <li>Você receberá um relatório completo ao finalizar</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExamModeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmExamMode}>
              Iniciar Modo Prova
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionHeader;