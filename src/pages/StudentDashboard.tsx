import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PerformanceMetrics } from "@/components/student/PerformanceMetrics";
import { SubjectProgress } from "@/components/student/SubjectProgress";
import { StudyGuide } from "@/components/student/StudyGuide";
import { BookOpen } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary text-center sm:text-left">
            CHQAO - Estude Praticando
          </h1>
          <Button variant="outline" onClick={() => navigate("/")} className="w-full sm:w-auto">
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Prática de Questões
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Aprenda praticando com questões selecionadas
              </p>
            </div>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              onClick={() => navigate("/question-practice")}
            >
              <BookOpen className="w-5 h-5" />
              Estudar por Questões
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <PerformanceMetrics {...performanceData} />
          <SubjectProgress subjects={subjectsProgress} />
          <StudyGuide {...studyGuideData} />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;