import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentCard } from "./statistics/StudentCard";
import { QuestionsCard } from "./statistics/QuestionsCard";
import { PreviousExamsCard } from "./statistics/PreviousExamsCard";
import { useQuestionsStats } from "./statistics/questions/QuestionsStats";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface StatisticsCardsProps {
  totalStudents: number;
  onlineUsers: number;
}

export const StatisticsCards = ({ 
  totalStudents: initialTotalStudents,
  onlineUsers: initialOnlineUsers,
}: StatisticsCardsProps) => {
  const { stats, fetchStats } = useQuestionsStats();
  const channelRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch total admins
  const { data: adminCount = 0 } = useQuery({
    queryKey: ['admin-count'],
    queryFn: async () => {
      console.log('Fetching admin count...');
      const { count, error } = await supabase
        .from('admins')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching admin count:', error);
        throw error;
      }
      
      return count || 0;
    }
  });

  // Subscribe to query cache updates
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      console.log('Query cache updated, refreshing statistics...');
      fetchStats().catch(error => {
        console.error('Error fetching stats:', error);
        toast({
          title: "Erro ao atualizar estatísticas",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, fetchStats, toast]);

  // Subscribe to real-time database changes with retry logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupRealtimeSubscription = async () => {
      try {
        console.log('Setting up real-time subscription for questions table...');
        
        const channel = supabase
          .channel('questions-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'questions'
            },
            (payload) => {
              console.log('Question change detected:', payload);
              fetchStats().catch(error => {
                console.error('Error fetching stats after change:', error);
              });
            }
          )
          .subscribe((status) => {
            console.log('Real-time subscription status:', status);
            if (status === 'SUBSCRIBED') {
              retryCount = 0; // Reset retry count on successful connection
            }
          });

        // Initialize presence channel with retry logic
        if (!channelRef.current) {
          console.log('Initializing presence channel...');
          channelRef.current = supabase.channel('online-users', {
            config: {
              presence: {
                key: 'user_presence',
              },
            },
          });

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
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
              console.log('User joined:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
              console.log('User left:', leftPresences);
            });

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
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying connection (attempt ${retryCount}/${maxRetries})...`);
                setTimeout(setupRealtimeSubscription, 2000 * retryCount); // Exponential backoff
              } else {
                console.error('Max retries reached for real-time connection');
                toast({
                  title: "Erro de conexão",
                  description: "Não foi possível estabelecer conexão em tempo real",
                  variant: "destructive"
                });
              }
            }
          });
        }

        return () => {
          console.log('Cleaning up subscriptions...');
          channel.unsubscribe();
          if (channelRef.current) {
            channelRef.current.unsubscribe();
            channelRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error in setupRealtimeSubscription:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying setup (attempt ${retryCount}/${maxRetries})...`);
          setTimeout(setupRealtimeSubscription, 2000 * retryCount);
        }
      }
    };

    setupRealtimeSubscription();
  }, [fetchStats, toast]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-6">
        <StudentCard 
          totalStudents={initialTotalStudents} 
          totalAdmins={adminCount}
        />
        <QuestionsCard 
          totalQuestions={stats.totalQuestions} 
          stats={stats}
        />
        <PreviousExamsCard 
          totalExams={stats.previousExams.total}
          totalQuestions={stats.previousExams.questions}
          onReset={fetchStats}
        />
      </div>
    </div>
  );
};
