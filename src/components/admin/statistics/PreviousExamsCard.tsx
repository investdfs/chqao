import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PreviousExamsCardProps {
  totalExams: number;
  totalQuestions: number;
  onReset: () => void;
}

export const PreviousExamsCard = ({ 
  totalExams,
  totalQuestions,
  onReset
}: PreviousExamsCardProps) => {
  const { toast } = useToast();

  const handleResetExams = async () => {
    try {
      console.log('Iniciando reset de provas anteriores...');
      
      const { error: deleteQuestionsError } = await supabase
        .from('previous_exam_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteQuestionsError) throw deleteQuestionsError;

      const { error: deleteExamsError } = await supabase
        .from('previous_exams')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteExamsError) throw deleteExamsError;

      toast({
        title: "Provas anteriores resetadas",
        description: "Todas as provas e questões foram removidas com sucesso.",
      });

      onReset();
    } catch (error) {
      console.error('Erro ao resetar provas:', error);
      toast({
        title: "Erro ao resetar provas",
        description: "Não foi possível remover as provas anteriores.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Provas Anteriores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total de Provas</p>
              <p className="text-2xl font-bold">{totalExams}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Questões</p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
              >
                Resetar Provas Anteriores
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todas as provas anteriores e suas questões serão removidas permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetExams}>
                  Confirmar Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};