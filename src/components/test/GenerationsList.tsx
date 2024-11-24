import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Generation {
  id: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  generated_questions: any[] | null;
  error_message: string | null;
  metadata: {
    originalName: string;
    fileSize: number;
  };
}

interface Props {
  generations: Generation[];
  onViewQuestions: (generation: Generation) => void;
}

export const GenerationsList = ({ generations, onViewQuestions }: Props) => {
  const { toast } = useToast();

  const handleSaveQuestions = async (questions: any[]) => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert(questions.map(q => ({
          ...q,
          subject: 'IA Generated',
        })));

      if (error) throw error;

      toast({
        title: "Questões salvas",
        description: `${questions.length} questões foram salvas com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao salvar questões:', error);
      toast({
        title: "Erro ao salvar questões",
        description: "Ocorreu um erro ao salvar as questões no banco.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      {generations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma geração realizada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <Card key={gen.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {gen.metadata?.originalName || 'Arquivo PDF'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {gen.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(gen.created_at).toLocaleString()}
                  </p>
                </div>
                {gen.status === 'completed' && (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onViewQuestions(gen)}
                    >
                      Ver Questões
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => gen.generated_questions && handleSaveQuestions(gen.generated_questions)}
                    >
                      Salvar no Banco
                    </Button>
                  </div>
                )}
              </div>
              {gen.error_message && (
                <p className="text-sm text-red-500 mt-2">
                  Erro: {gen.error_message}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};