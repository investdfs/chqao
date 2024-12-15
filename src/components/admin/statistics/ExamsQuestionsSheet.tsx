import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Eye, EyeOff, Search, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExamsQuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExamsQuestionsSheet = ({ 
  open, 
  onOpenChange 
}: ExamsQuestionsSheetProps) => {
  const [previousExamQuestions, setPreviousExamQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const { toast } = useToast();

  // Get unique years from questions
  const years = [...new Set(previousExamQuestions.map(q => q.exam_year))].sort((a, b) => b - a);

  useEffect(() => {
    if (open) {
      const fetchPreviousExamQuestions = async () => {
        try {
          console.log("Buscando questões de provas anteriores...");
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('is_from_previous_exam', true)
            .order('exam_year', { ascending: false });

          if (error) throw error;

          console.log("Questões encontradas:", data?.length);
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

  const filteredQuestions = previousExamQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || question.exam_year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPreviousExamQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Sucesso",
        description: "Questão excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir questão.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] w-full sm:max-w-[80vw] mx-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-primary">
            Questões de Provas Anteriores
          </SheetTitle>
        </SheetHeader>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar questões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100%-140px)] rounded-md border p-4">
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      Ano: {question.exam_year}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {question.text}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Implementar edição */}}
                      className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => {/* Implementar visualização */}}
                      className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => {/* Implementar ocultação */}}
                      className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <EyeOff className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 hover:bg-error/10 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-primary">
                  Gabarito: {question.correct_answer}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};