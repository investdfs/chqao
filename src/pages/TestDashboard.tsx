import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface GeneratedQuestion {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  theme: string;
}

interface Generation {
  id: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  generated_questions: GeneratedQuestion[] | null;
  error_message: string | null;
}

const TestDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  // Carregar gerações anteriores
  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async () => {
    const { data, error } = await supabase
      .from('ai_question_generations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar gerações:', error);
      return;
    }

    setGenerations(data);
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      console.log('Iniciando geração de questões:', content);

      // Criar registro inicial
      const { data: generation, error: insertError } = await supabase
        .from('ai_question_generations')
        .insert([{ content }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Chamar Edge Function
      const { error: functionError } = await supabase.functions.invoke('generate-questions', {
        body: { generationId: generation.id, content }
      });

      if (functionError) throw functionError;

      toast({
        title: "Processamento iniciado",
        description: "As questões estão sendo geradas. Aguarde a conclusão.",
      });

      // Atualizar lista
      await loadGenerations();

    } catch (error) {
      console.error('Erro ao gerar questões:', error);
      toast({
        title: "Erro ao gerar questões",
        description: "Ocorreu um erro durante o processamento.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setContent('');
    }
  };

  const handleSaveQuestions = async (questions: GeneratedQuestion[]) => {
    try {
      const { error } = await supabase
        .from('questions')
        .insert(questions.map(q => ({
          ...q,
          subject: 'IA Generated', // Você pode ajustar isso conforme necessário
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Testes - IA</h1>
          <Button variant="outline" onClick={() => navigate("/admin-dashboard")}>
            Voltar
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Gerar Questões com IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole aqui o texto base para gerar as questões..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSubmit}
                disabled={!content.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  "Iniciar Geração"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Gerações</CardTitle>
            </CardHeader>
            <CardContent>
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
                            Geração {new Date(gen.created_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {gen.status}
                          </p>
                        </div>
                        {gen.status === 'completed' && (
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              onClick={() => setSelectedGeneration(gen)}
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
            </CardContent>
          </Card>

          {/* Modal de Visualização */}
          {selectedGeneration && selectedGeneration.generated_questions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Questões Geradas</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGeneration(null)}
                  >
                    Fechar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {selectedGeneration.generated_questions.map((question, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-bold">Questão {index + 1}</h3>
                        <p>{question.text}</p>
                        <div className="space-y-2">
                          <p>A) {question.option_a}</p>
                          <p>B) {question.option_b}</p>
                          <p>C) {question.option_c}</p>
                          <p>D) {question.option_d}</p>
                          <p>E) {question.option_e}</p>
                        </div>
                        <div className="mt-4">
                          <p className="font-medium">Resposta: {question.correct_answer}</p>
                          <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <p>Dificuldade: {question.difficulty}</p>
                            <p>Tema: {question.theme}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;