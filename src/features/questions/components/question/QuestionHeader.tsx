import { Button } from "@/components/ui/button";
import { Moon, User, Zap, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAutoAnswer } from "@/features/questions/hooks/useAutoAnswer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const QuestionHeader = () => {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { isAutoAnswerEnabled, toggleAutoAnswer } = useAutoAnswer();

  const MobileHeader = () => (
    <div className="flex items-center justify-between p-2 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/student-dashboard")}
              className="flex items-center gap-2 w-full"
            >
              <User className="h-4 w-4" />
              Painel do Aluno
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="mobile-auto-answer"
                checked={isAutoAnswerEnabled}
                onCheckedChange={toggleAutoAnswer}
              />
              <Label htmlFor="mobile-auto-answer" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Auto-responder
              </Label>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8"
        >
          <Moon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const DesktopHeader = () => (
    <div className="hidden md:flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <Button
        variant="outline"
        onClick={() => navigate("/student-dashboard")}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Painel do Aluno
      </Button>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-answer"
            checked={isAutoAnswerEnabled}
            onCheckedChange={toggleAutoAnswer}
          />
          <Label htmlFor="auto-answer" className="flex items-center gap-2 cursor-pointer">
            <Zap className="h-4 w-4" />
            Auto-responder
          </Label>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Moon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <MobileHeader />
      <DesktopHeader />
    </>
  );
};

export default QuestionHeader;