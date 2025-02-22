import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { ProcessPdfRequest } from './types.ts';
import { generateQuestionsWithAI } from './openai.ts';
import { validateGeneratedQuestions } from './validation.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { generationId, filePath, questionCount, customInstructions, subject, theme } = await req.json() as ProcessPdfRequest;
    console.log('Iniciando processamento:', { generationId, filePath });

    if (!generationId || !filePath || !questionCount || !subject) {
      throw new Error('Parâmetros obrigatórios faltando: generationId, filePath, questionCount e subject são necessários');
    }

    // Buscar arquivo do storage
    console.log('Buscando arquivo do storage:', filePath);
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('pdf_uploads')
      .download(filePath);

    if (fileError || !fileData) {
      throw new Error(`Erro ao buscar arquivo: ${fileError?.message || 'Arquivo não encontrado'}`);
    }

    // Extrair texto do PDF
    const pdfText = await fileData.text();
    console.log('Texto extraído do PDF, tamanho:', pdfText.length);

    // Atualizar status para processando
    await supabase
      .from('ai_question_generations')
      .update({ status: 'processing' })
      .eq('id', generationId);

    // Gerar questões com retry logic
    let retryCount = 0;
    const maxRetries = 3;
    let generatedQuestions;

    while (retryCount < maxRetries) {
      try {
        console.log(`Tentativa ${retryCount + 1} de gerar questões...`);
        generatedQuestions = await generateQuestionsWithAI(pdfText, questionCount, subject, theme, customInstructions);
        break; // Se sucesso, sai do loop
      } catch (error) {
        retryCount++;
        console.error(`Erro na tentativa ${retryCount}:`, error);
        
        if (error.message.includes('Too Many Requests')) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          if (retryCount === maxRetries) {
            throw new Error('Limite de tentativas excedido ao gerar questões. Por favor, tente novamente mais tarde.');
          }
        } else {
          throw error; // Se não for erro de rate limit, propaga o erro
        }
      }
    }

    const validatedQuestions = validateGeneratedQuestions(generatedQuestions, questionCount);

    // Inserir questões no banco
    const { error: insertError } = await supabase
      .from('questions')
      .insert(validatedQuestions);

    if (insertError) {
      throw new Error(`Erro ao inserir questões: ${insertError.message}`);
    }

    // Atualizar geração com sucesso
    await supabase
      .from('ai_question_generations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_questions: validatedQuestions,
      })
      .eq('id', generationId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    
    // Atualizar geração com erro
    if (error.generationId) {
      await supabase
        .from('ai_question_generations')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', error.generationId);
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno no processamento do PDF' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});