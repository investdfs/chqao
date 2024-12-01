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

    if (!generationId || !filePath || !questionCount) {
      throw new Error('Parâmetros obrigatórios faltando');
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
    const content = await generateQuestionsWithAI(pdfText, questionCount, customInstructions);
    const generatedQuestions = validateGeneratedQuestions(JSON.parse(content), questionCount);

    // Atualizar geração com sucesso
    await supabase
      .from('ai_question_generations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_questions: generatedQuestions,
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