import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Signal } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [onlineUsers, setOnlineUsers] = useState(0);

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
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();

    // Set up real-time presence tracking
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: 'user_presence',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('Presence state updated:', presenceState);
        
        // Count unique users across all states
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
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const status = await channel.track({
            online_at: new Date().toISOString(),
            user_id: Math.random().toString(), // In a real app, use actual user ID
          });
          console.log('Presence tracking status:', status);
        }
      });

    // Cleanup
    return () => {
      console.log('Cleaning up presence channel...');
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Total de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalStudents}</div>
          <p className="text-gray-600">Alunos cadastrados</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Questões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{totalQuestions}</div>
          <p className="text-gray-600">Questões cadastradas</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Signal className="h-5 w-5" />
            Usuários Online
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{onlineUsers}</div>
          <p className="text-gray-600">Atualmente ativos</p>
        </CardContent>
      </Card>
    </div>
  );
};