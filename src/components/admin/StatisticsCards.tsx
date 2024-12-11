import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentCard } from "./statistics/StudentCard";
import { QuestionsCard } from "./statistics/QuestionsCard";
import { PreviousExamsCard } from "./statistics/PreviousExamsCard";

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
        const { data: examStats, error: examError } = await supabase
          .from('previous_exams')
          .select(`
            id,
            year,
            previous_exam_questions (
              count
            )
          `);

        if (examError) {
          console.error('Error fetching exam stats:', examError);
        } else {
          const totalExams = examStats?.length || 0;
          const totalQuestions = examStats?.reduce((sum, exam) => 
            sum + (exam.previous_exam_questions?.[0]?.count || 0), 0
          );
          
          setPreviousExams({
            total: totalExams,
            questions: totalQuestions
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
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-6">
        <StudentCard totalStudents={totalStudents} />
        <QuestionsCard totalQuestions={totalQuestions} />
        <PreviousExamsCard 
          totalExams={previousExams.total}
          totalQuestions={previousExams.questions}
          onReset={async () => {
            const { data: examStats, error: examError } = await supabase
              .from('previous_exams')
              .select(`
                id,
                year,
                previous_exam_questions (
                  count
                )
              `);

            if (!examError && examStats) {
              const totalExams = examStats.length;
              const totalQuestions = examStats.reduce((sum, exam) => 
                sum + (exam.previous_exam_questions?.[0]?.count || 0), 0
              );
              
              setPreviousExams({
                total: totalExams,
                questions: totalQuestions
              });
            }
          }}
        />
      </div>
    </div>
  );
};