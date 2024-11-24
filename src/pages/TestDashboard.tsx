import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const TestDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = React.useState('');

  const handleSubmit = async () => {
    try {
      console.log('Iniciando teste de geração de questões:', content);
      const { data, error } = await supabase
        .from('ai_question_generations')
        .insert([{ content }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Teste iniciado",
        description: "O processo de geração foi iniciado com sucesso.",
      });

      console.log('Teste iniciado com sucesso:', data);
    } catch (error) {
      console.error('Erro ao iniciar teste:', error);
      toast({
        title: "Erro ao iniciar teste",
        description: "Ocorreu um erro ao iniciar o teste de geração.",
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
              />
              <Button 
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="w-full"
              >
                Iniciar Teste de Geração
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Nenhum teste realizado ainda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;