import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionText } = await req.json();
    console.log('Recebendo requisição para gerar alternativas para:', questionText);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em criar alternativas para questões militares.
            Analise o texto da questão e gere 5 alternativas plausíveis (A, B, C, D, E).
            
            Regras:
            1. Mantenha as alternativas com tamanho similar
            2. Evite "todas as alternativas" ou "nenhuma das alternativas"
            3. Use linguagem formal militar
            4. Evite ambiguidades
            5. Retorne apenas um objeto JSON com as alternativas`
          },
          {
            role: 'user',
            content: `Gere 5 alternativas plausíveis para esta questão: ${questionText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const alternatives = {
      a: data.choices[0]?.message?.content?.split('\n')[0]?.replace('A) ', '').replace('A.', '').trim(),
      b: data.choices[0]?.message?.content?.split('\n')[1]?.replace('B) ', '').replace('B.', '').trim(),
      c: data.choices[0]?.message?.content?.split('\n')[2]?.replace('C) ', '').replace('C.', '').trim(),
      d: data.choices[0]?.message?.content?.split('\n')[3]?.replace('D) ', '').replace('D.', '').trim(),
      e: data.choices[0]?.message?.content?.split('\n')[4]?.replace('E) ', '').replace('E.', '').trim(),
    };

    console.log('Alternativas geradas:', alternatives);

    return new Response(JSON.stringify({ alternatives }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao gerar alternativas:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});