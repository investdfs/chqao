import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { generationId, content } = await req.json();
    console.log(`Processando geração ${generationId} com conteúdo: ${content.substring(0, 100)}...`);

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Atualizar status para processing
    await supabase
      .from('ai_question_generations')
      .update({ status: 'processing' })
      .eq('id', generationId);

    // Gerar questões com OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em criar questões de múltipla escolha. 
            Gere 5 questões baseadas no conteúdo fornecido.
            Cada questão deve ter:
            - Texto da questão
            - 5 alternativas (A a E)
            - Resposta correta
            - Explicação
            - Nível de dificuldade (Fácil, Médio ou Difícil)
            - Tema principal
            Retorne em formato JSON.`
          },
          { role: 'user', content }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    console.log('Resposta da IA recebida:', aiResponse);

    const generatedQuestions = JSON.parse(aiResponse.choices[0].message.content);

    // Atualizar registro com as questões geradas
    const { error: updateError } = await supabase
      .from('ai_question_generations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_questions: generatedQuestions,
      })
      .eq('id', generationId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, questions: generatedQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao gerar questões:', error);

    // Atualizar registro com erro
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('ai_question_generations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', generationId);

    return new Response(
      JSON.stringify({ error: 'Erro ao gerar questões', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});