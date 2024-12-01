import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PerformanceMetrics } from "@/components/student/PerformanceMetrics";
import { SubjectProgress } from "@/components/student/SubjectProgress";
import { StudyGuide } from "@/components/student/StudyGuide";
import { BookOpen, LogOut } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStatus = location.state?.userStatus || "active";

  const performanceData = {
    correctAnswers: 3,
    totalQuestions: 4,
    studyTime: "5m 12s",
    averageTime: "1m 18s",
  };

  const subjectsProgress = [
    { name: "Biologia", questionsAnswered: 3, correctAnswers: 2 },
    { name: "Português", questionsAnswered: 1, correctAnswers: 1 },
  ];

  const studyGuideData = {
    weakPoints: ["Genética", "Ecologia"],
    strongPoints: ["Evolução", "População"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            CHQAO - Estude Praticando
          </h1>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto hover:bg-primary-light/50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-primary via-accent-purple to-accent-pink shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Prática de Questões
              </h2>
              <p className="text-white/80">
                Aprenda praticando com questões selecionadas especialmente para você
              </p>
            </div>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-white text-primary hover:bg-primary-light transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md"
              onClick={() => navigate("/question-practice")}
            >
              <BookOpen className="w-5 h-5" />
              Estudar por Questões
            </Button>
          </div>
        </Card>

        <div className="space-y-8">
          <PerformanceMetrics {...performanceData} />
          
          <div className="grid lg:grid-cols-2 gap-8">
            <SubjectProgress subjects={subjectsProgress} />
            <StudyGuide {...studyGuideData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;