import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentCard } from "./statistics/StudentCard";
import { QuestionsCard } from "./statistics/QuestionsCard";
import { PreviousExamsCard } from "./statistics/PreviousExamsCard";
import { useQuestionsStats } from "./statistics/questions/QuestionsStats";
import { useQueryClient } from "@tanstack/react-query";

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

  // Subscribe to query cache updates
  useEffect(() => {
    // Refetch stats when queries are invalidated
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      console.log('Query cache updated, refreshing statistics...');
      fetchStats();
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, fetchStats]);

  // Subscribe to real-time database changes
  useEffect(() => {
    console.log('Setting up real-time subscription for questions table...');
    
    const channel = supabase
      .channel('questions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'questions'
        },
        (payload) => {
          console.log('Question change detected:', payload);
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

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
      console.log('Cleaning up subscriptions...');
      channel.unsubscribe();
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [fetchStats]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-6">
        <StudentCard totalStudents={initialTotalStudents} />
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