import { Button } from "@/components/ui/button";
import { BookOpen, History } from "lucide-react";

interface StudyModeSelectorProps {
  onPracticeClick: () => void;
  onExamClick: () => void;
}

export const StudyModeSelector = ({ onPracticeClick, onExamClick }: StudyModeSelectorProps) => {
  return (
    <div className="bg-gradient-primary rounded-xl shadow-lg p-8 mb-8 animate-fade-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
        Escolha seu modo de estudo
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onPracticeClick}
          className="w-full sm:w-64 h-20 text-lg font-semibold bg-white hover:bg-gray-100 text-primary hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <BookOpen className="w-6 h-6" />
          Praticar Questões
        </Button>
        <Button
          onClick={onExamClick}
          className="w-full sm:w-64 h-20 text-lg font-semibold bg-white hover:bg-gray-100 text-primary hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <History className="w-6 h-6" />
          Provas Anteriores
        </Button>
      </div>
    </div>
  );
};