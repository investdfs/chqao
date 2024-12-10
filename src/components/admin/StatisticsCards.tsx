import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Signal, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface StatisticsCardsProps {
  totalStudents: number;
  onlineUsers: number;
}

export const StatisticsCards = ({ 
  totalStudents: initialTotalStudents,
  onlineUsers: initialOnlineUsers,
}: StatisticsCardsProps) => {
  const [totalStudents, setTotalStudents] = useState(initialTotalStudents);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(initialOnlineUsers);
  const [previousExams, setPreviousExams] = useState({ total: 0, questions: 0 });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [examYears, setExamYears] = useState<number[]>([]);
  const [previousExamQuestions, setPreviousExamQuestions] = useState<any[]>([]);
  const [showQuestionsSheet, setShowQuestionsSheet] = useState(false);
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        console.log('Fetching statistics from Supabase...');
        
        // Fetch total students
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        if (studentsError) {
          console.error('Error fetching students:', studentsError);
        } else {
          console.log('Total students:', studentsCount);
          setTotalStudents(studentsCount || 0);
        }

        // Fetch total questions
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
        } else {
          console.log('Total questions:', questionsCount);
          setTotalQuestions(questionsCount || 0);
        }

        // Fetch previous exams statistics and available years
        const { data: examQuestions, error: examError } = await supabase
          .from('questions')
          .select('exam_year')
          .eq('is_from_previous_exam', true);

        if (examError) {
          console.error('Error fetching exam questions:', examError);
        } else {
          const uniqueYears = new Set(examQuestions?.map(q => q.exam_year).filter(Boolean));
          setExamYears(Array.from(uniqueYears).sort((a, b) => b - a));
          setPreviousExams({
            total: uniqueYears.size,
            questions: examQuestions?.length || 0
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();

    // Initialize presence channel if not already created
    if (!channelRef.current) {
      console.log('Initializing presence channel...');
      channelRef.current = supabase.channel('online-users', {
        config: {
          presence: {
            key: 'user_presence',
          },
        },
      });

      // Set up presence handlers
      channelRef.current
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channelRef.current.presenceState();
          console.log('Presence state updated:', presenceState);
          
          const uniqueUsers = new Set();
          Object.values(presenceState).forEach(stateUsers => {
            (stateUsers as any[]).forEach(user => {
              uniqueUsers.add(user.user_id);
            });
          });
          
          console.log('Online users count:', uniqueUsers.size);
          setOnlineUsers(uniqueUsers.size);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', leftPresences);
        });

      // Subscribe and track presence
      channelRef.current.subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('Channel subscribed successfully');
          const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          try {
            const status = await channelRef.current.track({
              online_at: new Date().toISOString(),
              user_id: userId,
            });
            console.log('Presence tracking status:', status);
          } catch (error) {
            console.error('Error tracking presence:', error);
          }
        } else {
          console.log('Channel subscription status:', status);
        }
      });
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up presence channel...');
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  const handleResetExamQuestions = async () => {
    if (!selectedYear) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um ano para resetar",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('is_from_previous_exam', true)
        .eq('exam_year', parseInt(selectedYear));

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Questões do ano ${selectedYear} foram removidas com sucesso.`,
      });

      // Refresh statistics
      const fetchStatistics = async () => {
        const { data: examQuestions, error: examError } = await supabase
          .from('questions')
          .select('exam_year')
          .eq('is_from_previous_exam', true);

        if (!examError && examQuestions) {
          const uniqueYears = new Set(examQuestions.map(q => q.exam_year));
          setPreviousExams({
            total: uniqueYears.size,
            questions: examQuestions.length
          });
        }
      };

      fetchStatistics();
      setShowResetDialog(false);
      setSelectedYear("");
    } catch (error) {
      console.error('Error resetting exam questions:', error);
      toast({
        title: "Erro",
        description: "Erro ao resetar questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const fetchPreviousExamQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_from_previous_exam', true)
        .order('exam_year', { ascending: false });

      if (error) throw error;

      setPreviousExamQuestions(data || []);
      setShowQuestionsSheet(true);
    } catch (error) {
      console.error('Error fetching previous exam questions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <Users className="h-4 w-4" />
            Total de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary">{totalStudents}</div>
          <p className="text-xs text-gray-600">Alunos cadastrados</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <BookOpen className="h-4 w-4" />
            Questões
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
          <p className="text-xs text-gray-600">Questões cadastradas</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <FileText className="h-4 w-4" />
            Provas Anteriores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary">{previousExams.total}</div>
          <p className="text-xs text-gray-600">{previousExams.questions} questões</p>
          <div className="mt-2 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={fetchPreviousExamQuestions}
            >
              Ver Questões
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => setShowResetDialog(true)}
            >
              Resetar Banco
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar Questões de Prova Anterior</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o ano da prova que deseja apagar as questões.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {examYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetExamQuestions}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={showQuestionsSheet} onOpenChange={setShowQuestionsSheet}>
        <SheetContent className="w-[90%] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Questões de Provas Anteriores</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {previousExamQuestions.map((question) => (
              <div key={question.id} className="border-b pb-4">
                <div className="font-semibold mb-2">
                  Ano: {question.exam_year}
                </div>
                <div className="text-sm">
                  {question.text}
                </div>
                <div className="mt-2 text-sm text-primary">
                  Gabarito: {question.correct_answer}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
