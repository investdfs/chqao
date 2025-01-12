import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useRealtimeQuestions = (onQuestionsChange: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
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
          onQuestionsChange();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up questions subscription...');
      channel.unsubscribe();
    };
  }, [onQuestionsChange, toast]);
};