const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Definição da função que o modelo GPT irá "chamar"
const questionFunction = {
  name: "generate_question",
  description: "Gera uma questão de múltipla escolha baseada no conteúdo fornecido",
  parameters: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "O texto da questão"
      },
      option_a: {
        type: "string",
        description: "Texto da alternativa A"
      },
      option_b: {
        type: "string",
        description: "Texto da alternativa B"
      },
      option_c: {
        type: "string",
        description: "Texto da alternativa C"
      },
      option_d: {
        type: "string",
        description: "Texto da alternativa D"
      },
      option_e: {
        type: "string",
        description: "Texto da alternativa E"
      },
      correct_answer: {
        type: "string",
        enum: ["A", "B", "C", "D", "E"],
        description: "A letra da alternativa correta"
      },
      explanation: {
        type: "string",
        description: "Explicação detalhada da resposta correta"
      },
      difficulty: {
        type: "string",
        enum: ["Fácil", "Médio", "Difícil"],
        description: "Nível de dificuldade da questão"
      },
      topic: {
        type: "string",
        description: "Tópico específico abordado na questão"
      }
    },
    required: ["text", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_answer", "explanation", "difficulty", "topic"]
  }
};

export async function generateQuestionsWithAI(
  pdfText: string, 
  questionCount: number, 
  subject: string, 
  theme: string, 
  customInstructions?: string
) {
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
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em criar questões militares objetivas. 
              Analise o texto fornecido e gere ${questionCount} questões.
              Use a função generate_question para cada questão.
              
              Regras importantes:
              1. Use linguagem formal militar
              2. Mantenha as questões objetivas e claras
              3. Evite ambiguidades nas alternativas
              4. Inclua explicações detalhadas e fundamentadas
              5. Distribua as questões entre diferentes níveis de dificuldade
              6. Baseie-se APENAS no conteúdo fornecido
              7. Evite questões com "EXCETO" ou "INCORRETO"
              8. Mantenha as alternativas com comprimento similar
              9. Não use "todas as alternativas" ou "nenhuma das alternativas"
              ${customInstructions ? `10. Instruções adicionais: ${customInstructions}` : ''}`
            },
            { 
              role: 'user', 
              content: `Matéria: ${subject}\nTema: ${theme}\n\nConteúdo:\n${pdfText}` 
            }
          ],
          functions: [questionFunction],
          function_call: "auto",
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.statusText || errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Processar as chamadas de função retornadas
      const generatedQuestions = data.choices.map((choice: any) => {
        if (choice.message?.function_call) {
          const functionArgs = JSON.parse(choice.message.function_call.arguments);
          return {
            ...functionArgs,
            subject,
            theme,
            is_ai_generated: true,
            status: 'active'
          };
        }
        return null;
      }).filter(Boolean);

      console.log(`Geradas ${generatedQuestions.length} questões com sucesso`);
      return generatedQuestions;

    } catch (error) {
      console.error(`Erro na tentativa ${attempt + 1}:`, error);
      lastError = error;
      
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt);
        console.log(`Aguardando ${waitTime}ms antes da próxima tentativa...`);
        await delay(waitTime);
      }
    }
  }

  throw lastError || new Error('Falha ao gerar questões após todas as tentativas');
}