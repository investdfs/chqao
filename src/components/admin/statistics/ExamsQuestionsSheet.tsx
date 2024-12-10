import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface ExamsQuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExamsQuestionsSheet = ({ 
  open, 
  onOpenChange 
}: ExamsQuestionsSheetProps) => {
  const [previousExamQuestions, setPreviousExamQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const fetchPreviousExamQuestions = async () => {
        try {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('is_from_previous_exam', true)
            .order('exam_year', { ascending: false });

          if (error) throw error;

          setPreviousExamQuestions(data || []);
        } catch (error) {
          console.error('Error fetching previous exam questions:', error);
          toast({
            title: "Erro",
            description: "Erro ao carregar questões. Tente novamente.",
            variant: "destructive",
          });
        }
      };

      fetchPreviousExamQuestions();
    }
  }, [open, toast]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
  );
};