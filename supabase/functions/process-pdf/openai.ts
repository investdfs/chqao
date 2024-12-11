const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateQuestionsWithAI(pdfText: string, questionCount: number, subject: string, theme: string, customInstructions?: string) {
  const openaiKey = Deno.env.get('OPENAI_API_KEY')!;
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Tentativa ${attempt + 1} de ${MAX_RETRIES} de gerar questões`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Usando o modelo mais rápido
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
                "subject": "${subject}",
                "theme": "${theme}",
                "topic": "tópico específico da questão",
                "is_ai_generated": true
              }
              
              2. Retorne um array com ${questionCount} objetos neste formato.
              3. Use linguagem formal militar.
              4. Mantenha as questões objetivas e claras.
              5. Evite ambiguidades nas alternativas.
              6. Inclua explicações detalhadas e fundamentadas.
              7. Distribua as questões entre diferentes níveis de dificuldade.
              8. Baseie-se APENAS no conteúdo fornecido.
              9. Evite questões com "EXCETO" ou "INCORRETO".
              10. Mantenha as alternativas com comprimento similar.
              11. Não use "todas as alternativas" ou "nenhuma das alternativas".
              ${customInstructions ? `12. Instruções adicionais: ${customInstructions}` : ''}`
            },
            { role: 'user', content: pdfText }
          ],
          temperature: 0.7,
          max_tokens: 2000, // Reduzindo o número de tokens para respostas mais rápidas
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.statusText || errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const generatedQuestions = JSON.parse(data.choices[0]?.message?.content || '[]');
      
      console.log(`Geradas ${generatedQuestions.length} questões com sucesso`);
      return generatedQuestions;
    } catch (error) {
      console.error(`Erro na tentativa ${attempt + 1}:`, error);
      lastError = error;
      
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.log(`Aguardando ${waitTime}ms antes da próxima tentativa...`);
        await delay(waitTime);
      }
    }
  }

  throw lastError || new Error('Falha ao gerar questões após todas as tentativas');
}