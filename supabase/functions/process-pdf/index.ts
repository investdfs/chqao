import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
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
  is_ai_generated: boolean;
}

serve(async (req) => {
  try {
    const { generationId, filePath, questionCount, customInstructions } = await req.json();
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

    // Chamada para OpenAI com prompt estruturado
    console.log('Chamando API OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em criar questões militares objetivas.
            Analise o texto fornecido e gere questões seguindo estas regras:
            
            1. Use este formato JSON para cada questão:
            {
              "text": "texto da questão",
              "option_a": "alternativa A",
              "option_b": "alternativa B",
              "option_c": "alternativa C",
              "option_d": "alternativa D",
              "option_e": "alternativa E",
              "correct_answer": "A|B|C|D|E",
              "explanation": "explicação detalhada da resposta",
              "difficulty": "Fácil|Médio|Difícil",
              "theme": "tema principal da questão",
              "is_ai_generated": true
            }
            
            2. Retorne um array com ${questionCount} objetos neste formato.
            3. Use linguagem formal militar.
            4. Mantenha as questões objetivas e claras.
            5. Evite ambiguidades nas alternativas.
            6. Inclua explicações detalhadas e fundamentadas.
            7. Distribua as questões entre diferentes níveis de dificuldade.
            ${customInstructions ? `8. Instruções adicionais: ${customInstructions}` : ''}`
          },
          { role: 'user', content: pdfText }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    console.log('Resposta recebida da IA');

    let generatedQuestions;
    try {
      // Tentar extrair array de questões da resposta
      const content = aiResponse.choices[0]?.message?.content;
      generatedQuestions = JSON.parse(content);

      if (!Array.isArray(generatedQuestions)) {
        throw new Error('Resposta da IA não é um array');
      }

      if (generatedQuestions.length !== parseInt(questionCount)) {
        throw new Error(`Número incorreto de questões geradas. Esperado: ${questionCount}, Recebido: ${generatedQuestions.length}`);
      }

      generatedQuestions.forEach((q, index) => {
        // Validação de campos obrigatórios
        const requiredFields = ['text', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'explanation', 'difficulty', 'theme'];
        const missingFields = requiredFields.filter(field => !q[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Questão ${index + 1} está faltando campos obrigatórios: ${missingFields.join(', ')}`);
        }

        // Validação de resposta correta
        if (!['A', 'B', 'C', 'D', 'E'].includes(q.correct_answer)) {
          throw new Error(`Questão ${index + 1} tem resposta inválida: ${q.correct_answer}`);
        }

        // Validação de dificuldade
        if (!['Fácil', 'Médio', 'Difícil'].includes(q.difficulty)) {
          throw new Error(`Questão ${index + 1} tem dificuldade inválida: ${q.difficulty}`);
        }

        // Validação de comprimento mínimo
        if (q.text.length < 20) {
          throw new Error(`Questão ${index + 1} tem texto muito curto`);
        }

        if (q.explanation.length < 30) {
          throw new Error(`Questão ${index + 1} tem explicação muito curta`);
        }

        // Marcar como gerada por IA
        q.is_ai_generated = true;
      });

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
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      
      // Atualizar geração com erro
      await supabase
        .from('ai_question_generations')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq('id', generationId);

      throw error;
    }

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno no processamento do PDF' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});