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

    if (!questionText) {
      throw new Error('Texto da questão não fornecido');
    }

    console.log('Gerando alternativas para:', questionText);

    const prompt = `
      Com base no texto da questão abaixo, gere 5 alternativas plausíveis (A a E).
      As alternativas devem ser coerentes com o texto e ter aproximadamente o mesmo tamanho.
      Retorne apenas as alternativas em formato JSON, sem explicações adicionais.
      
      Questão: ${questionText}
      
      Formato esperado:
      {
        "a": "texto da alternativa A",
        "b": "texto da alternativa B",
        "c": "texto da alternativa C",
        "d": "texto da alternativa D",
        "e": "texto da alternativa E"
      }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em criar alternativas para questões de múltipla escolha.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log('Resposta da OpenAI:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Resposta inválida da API');
    }

    const alternatives = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ alternatives }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função generate-alternatives:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao gerar alternativas. Por favor, tente novamente.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});