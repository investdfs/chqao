import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useRealtimeSessions = () => {
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
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
            toast({
              title: "Erro ao rastrear presença",
              description: "Não foi possível iniciar o rastreamento de usuários online",
              variant: "destructive"
            });
          }
        } else {
          console.log('Channel subscription status:', status);
        }
      });
    }

    return () => {
      console.log('Cleaning up presence channel...');
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [toast]);

  return channelRef;
};