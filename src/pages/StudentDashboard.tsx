import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudyGuide } from "@/components/student/StudyGuide";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Sample data - In a real app, this would come from your backend
  const weakPoints = ["Genética", "Ecologia"];
  const strongPoints = ["Evolução", "População"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Painel do Estudante</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 border-2 border-primary bg-primary/5">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              Área de Prática
            </h2>
            <Button
              size="lg"
              className="w-full sm:w-auto animate-pulse hover:animate-none transition-all duration-300 group"
              onClick={() => navigate("/question-practice")}
            >
              <BookOpen className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Estudar por Questões
            </Button>
          </div>
        </Card>

        <StudyGuide weakPoints={weakPoints} strongPoints={strongPoints} />
      </main>
    </div>
  );
};

export default StudentDashboard;