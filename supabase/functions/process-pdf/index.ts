import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedQuestion {
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  theme: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando processamento de PDF...');
    const { generationId, filePath, questionCount, customInstructions } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download do PDF
    console.log(`Baixando PDF: ${filePath}`);
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdf_uploads')
      .download(filePath);

    if (downloadError) {
      console.error('Erro ao baixar PDF:', downloadError);
      throw downloadError;
    }

    const pdfText = await fileData.text();
    console.log('Texto extraído do PDF, tamanho:', pdfText.length);

    // Chamada para OpenAI com prompt estruturado
    console.log('Chamando API OpenAI...');
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
            content: `Você é um especialista em criar questões de múltipla escolha para concursos militares.
            Gere exatamente ${questionCount} questões baseadas no conteúdo fornecido.
            
            Regras importantes:
            1. Cada questão DEVE seguir exatamente este formato JSON:
            {
              "text": "texto da questão",
              "option_a": "texto da opção A",
              "option_b": "texto da opção B",
              "option_c": "texto da opção C",
              "option_d": "texto da opção D",
              "option_e": "texto da opção E",
              "correct_answer": "A|B|C|D|E",
              "explanation": "explicação detalhada da resposta",
              "difficulty": "Fácil|Médio|Difícil",
              "theme": "tema principal da questão"
            }
            
            2. Retorne um array com ${questionCount} objetos neste formato.
            3. Use linguagem formal militar.
            4. Mantenha as questões objetivas e claras.
            5. Evite ambiguidades nas alternativas.
            ${customInstructions ? `6. Instruções adicionais: ${customInstructions}` : ''}`
          },
          { role: 'user', content: pdfText }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    console.log('Resposta recebida da IA');

    // Validação do JSON retornado
    let generatedQuestions: GeneratedQuestion[];
    try {
      generatedQuestions = JSON.parse(aiResponse.choices[0].message.content);
      
      // Validação adicional
      if (!Array.isArray(generatedQuestions)) {
        throw new Error('Resposta da IA não é um array');
      }

      generatedQuestions.forEach((q, index) => {
        if (!q.text || !q.option_a || !q.option_b || !q.option_c || 
            !q.option_d || !q.option_e || !q.correct_answer || 
            !q.explanation || !q.difficulty || !q.theme) {
          throw new Error(`Questão ${index + 1} está faltando campos obrigatórios`);
        }

        if (!['A', 'B', 'C', 'D', 'E'].includes(q.correct_answer)) {
          throw new Error(`Questão ${index + 1} tem resposta inválida: ${q.correct_answer}`);
        }

        if (!['Fácil', 'Médio', 'Difícil'].includes(q.difficulty)) {
          throw new Error(`Questão ${index + 1} tem dificuldade inválida: ${q.difficulty}`);
        }
      });

    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      throw new Error(`Formato inválido na resposta da IA: ${error.message}`);
    }

    // Atualizar registro com questões validadas
    console.log('Atualizando registro com questões geradas...');
    const { error: updateError } = await supabase
      .from('ai_question_generations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_questions: generatedQuestions,
      })
      .eq('id', generationId);

    if (updateError) {
      console.error('Erro ao atualizar registro:', updateError);
      throw updateError;
    }

    console.log('Processamento concluído com sucesso');
    return new Response(
      JSON.stringify({ success: true, questions: generatedQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    
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
      JSON.stringify({ 
        error: 'Erro ao processar PDF', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});