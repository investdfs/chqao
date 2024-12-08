import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Signal, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const channelRef = useRef<any>(null);

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

        // Fetch previous exams statistics
        const { data: examQuestions, error: examError } = await supabase
          .from('questions')
          .select('exam_year', { count: 'exact' })
          .eq('is_from_previous_exam', true);

        if (examError) {
          console.error('Error fetching exam questions:', examError);
        } else {
          const uniqueYears = new Set(examQuestions?.map(q => q.exam_year));
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
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-primary text-sm">
            <Signal className="h-4 w-4" />
            Usuários Online
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-primary">{onlineUsers}</div>
          <p className="text-xs text-gray-600">Atualmente ativos</p>
        </CardContent>
      </Card>
    </div>
  );
};