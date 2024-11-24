import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PdfUploadCard } from '@/components/test/PdfUploadCard';
import { GenerationsList } from '@/components/test/GenerationsList';
import { Json } from '@/integrations/supabase/types';

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
  metadata: {
    originalName: string;
    fileSize: number;
  };
}

const TestDashboard = () => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

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

    // Transform the data to match the Generation interface
    const transformedData: Generation[] = data.map(item => ({
      id: item.id,
      content: item.content,
      status: item.status,
      created_at: item.created_at,
      generated_questions: item.generated_questions as GeneratedQuestion[] | null,
      error_message: item.error_message,
      metadata: item.metadata as { originalName: string; fileSize: number }
    }));

    console.log('Transformed generations data:', transformedData);
    setGenerations(transformedData);
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
          <PdfUploadCard />
          <GenerationsList 
            generations={generations}
            onViewQuestions={(gen) => setSelectedGeneration(gen)}
          />

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