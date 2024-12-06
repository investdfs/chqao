import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PerformanceMetrics } from "@/components/student/PerformanceMetrics";
import { SubjectProgress } from "@/components/student/SubjectProgress";
import { StudyGuide } from "@/components/student/StudyGuide";
import { BookOpen, LogOut, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch student data
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
        return null;
      }
      return session;
    },
  });

  // Fetch student performance data
  const { data: performanceData } = useQuery({
    queryKey: ['studentPerformance', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_student_performance', {
          student_id_param: session.user.id
        });

      if (error) {
        console.error('Error fetching performance:', error);
        return null;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleResetProgress = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .rpc('reset_student_progress', {
          student_id_param: session.user.id
        });

      if (error) throw error;

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['studentPerformance'] });

      toast({
        title: "Progresso resetado com sucesso",
        description: "Todas as suas estatísticas foram zeradas.",
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast({
        variant: "destructive",
        title: "Erro ao resetar progresso",
        description: "Tente novamente mais tarde.",
      });
    }
  };

  // Transform performance data for SubjectProgress component
  const subjectsProgress = performanceData?.map(subject => ({
    name: subject.subject,
    questionsAnswered: Number(subject.questions_answered),
    correctAnswers: Number(subject.correct_answers),
  })) || [];

  const studyGuideData = {
    weakPoints: subjectsProgress
      .filter(subject => (subject.correctAnswers / subject.questionsAnswered) < 0.7)
      .map(subject => subject.name),
    strongPoints: subjectsProgress
      .filter(subject => (subject.correctAnswers / subject.questionsAnswered) >= 0.7)
      .map(subject => subject.name),
  };

  // Calculate total statistics
  const totalCorrectAnswers = subjectsProgress.reduce((sum, subject) => sum + subject.correctAnswers, 0);
  const totalQuestionsAnswered = subjectsProgress.reduce((sum, subject) => sum + subject.questionsAnswered, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            CHQAO - Estude Praticando
          </h1>
          <div className="flex items-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Zerar Estatísticas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Zerar todas as estatísticas?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todo seu progresso será apagado
                    e você começará do zero.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetProgress}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    APAGAR DADOS
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")} 
              className="hover:bg-primary-light/50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
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
          <PerformanceMetrics
            correctAnswers={totalCorrectAnswers}
            totalQuestions={totalQuestionsAnswered}
            studyTime="--"
            averageTime="--"
          />
          
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