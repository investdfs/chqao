import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryWithDelay(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status === 429) {
      console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryWithDelay(fn, retries - 1);
    }
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing PDF request...');
    const { generationId, filePath, questionCount, customInstructions } = await req.json();
    console.log(`Processing generation ${generationId} with file: ${filePath}`);
    console.log(`Question count: ${questionCount}, Custom instructions: ${customInstructions}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the PDF from Storage
    console.log('Downloading PDF from storage...');
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdf_uploads')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw downloadError;
    }

    // Convert PDF to text
    const pdfText = await fileData.text();
    console.log('PDF text extracted, length:', pdfText.length);

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: openAIApiKey,
    });
    const openai = new OpenAIApi(configuration);

    // Generate questions with OpenAI with retry mechanism
    console.log('Calling OpenAI API with retry mechanism...');
    const completion = await retryWithDelay(async () => {
      return await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em criar questões de múltipla escolha. 
            Gere ${questionCount} questões baseadas no conteúdo fornecido.
            ${customInstructions ? `Instruções adicionais: ${customInstructions}` : ''}
            Cada questão deve ter:
            - Texto da questão
            - 5 alternativas (A a E)
            - Resposta correta
            - Explicação
            - Nível de dificuldade (Fácil, Médio ou Difícil)
            - Tema principal
            Retorne em formato JSON.`
          },
          { role: "user", content: pdfText }
        ],
        temperature: 0.7,
      });
    });

    const generatedQuestions = JSON.parse(completion.data.choices[0].message.content);

    // Update record with generated questions
    console.log('Updating generation record with questions...');
    const { error: updateError } = await supabase
      .from('ai_question_generations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_questions: generatedQuestions,
      })
      .eq('id', generationId);

    if (updateError) {
      console.error('Error updating generation record:', updateError);
      throw updateError;
    }

    console.log('Process completed successfully');
    return new Response(
      JSON.stringify({ success: true, questions: generatedQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing PDF:', error);
    
    // Create Supabase client for error handling
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update record with error
    if (error.generationId) {
      await supabase
        .from('ai_question_generations')
        .update({
          status: 'failed',
          error_message: error.message || 'Unknown error occurred',
        })
        .eq('id', error.generationId);
    }

    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: 'Error processing PDF', 
        details: errorMessage,
        status: error.response?.status || 500
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});