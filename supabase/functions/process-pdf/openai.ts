const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const questionFunction = {
  name: "generate_question",
  description: "Gera uma questão de múltipla escolha baseada no conteúdo fornecido",
  parameters: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "O texto completo da questão"
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
      },
      theme: {
        type: "string",
        description: "Tema principal da questão"
      },
      subject: {
        type: "string",
        description: "Matéria da questão"
      },
      is_previous_exam: {
        type: "boolean",
        description: "Indica se é uma questão de prova anterior"
      }
    },
    required: ["text", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_answer", "explanation", "difficulty", "topic", "theme", "subject", "is_previous_exam"]
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
              content: `Você é um especialista em criar questões militares objetivas de múltipla escolha. 
              Analise o conteúdo fornecido e gere ${questionCount} questões seguindo estas regras:

              1. REGRAS DE FORMATAÇÃO:
              - Use linguagem formal militar
              - Evite questões com "EXCETO" ou "INCORRETO"
              - Mantenha as alternativas com comprimento similar
              - Evite uso de "todas as alternativas" ou "nenhuma das alternativas"
              - Não use numeração ou marcadores nas alternativas
              - Não inclua "A)", "B)", etc. no início das alternativas

              2. REGRAS DE CONTEÚDO:
              - Baseie-se estritamente no conteúdo fornecido
              - Distribua as questões entre diferentes níveis de dificuldade
              - Evite questões com pegadinhas ou ambiguidades
              - Inclua explicações detalhadas e fundamentadas
              - Mantenha o foco em conceitos importantes
              - Evite questões que dependam de memorização de números específicos

              3. VALIDAÇÕES:
              - Certifique-se que existe apenas uma resposta correta
              - Verifique se todas as alternativas são plausíveis
              - Confirme se a explicação justifica claramente a resposta correta
              - Garanta que o tema e tópico estão alinhados com o conteúdo
              - Verifique se o nível de dificuldade está adequado

              4. DIFICULDADE:
              Fácil:
              - Questões diretas
              - Conceitos básicos
              - Pouca interpretação necessária

              Médio:
              - Questões que requerem análise
              - Combinação de conceitos
              - Interpretação moderada

              Difícil:
              - Questões que exigem análise profunda
              - Múltiplos conceitos interligados
              - Alta capacidade de interpretação

              5. CAMPOS ESPECIAIS:
              - Matéria: Use o valor fornecido no campo 'subject'
              - Tema: Use o valor fornecido no campo 'theme' ou derive do conteúdo
              - Nova Questão: Indique através do campo 'is_previous_exam' como false
              - Questão de Prova Anterior: Se identificar que é uma questão de prova anterior, marque 'is_previous_exam' como true

              Use a função generate_question para cada questão, garantindo que todos os campos obrigatórios sejam preenchidos corretamente.
              ${customInstructions ? `\n\nInstruções adicionais: ${customInstructions}` : ''}`
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