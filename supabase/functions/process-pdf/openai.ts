import "https://deno.land/x/xhr@0.1.0/mod.ts";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SYSTEM_PROMPT = `Você é um especialista em criar e transcrever questões militares objetivas de múltipla escolha. 
Analise o conteúdo fornecido e siga estas instruções rigorosamente:

# MODOS DE OPERAÇÃO E ESTRUTURAS JSON

## 1. TRANSCRIÇÃO DE PROVAS ANTERIORES
Use esta estrutura para questões de provas anteriores:
{
  "text": "Enunciado exato da questão da prova",
  "option_a": "Alternativa A exata da prova",
  "option_b": "Alternativa B exata da prova",
  "option_c": "Alternativa C exata da prova",
  "option_d": "Alternativa D exata da prova",
  "option_e": "Alternativa E exata da prova",
  "correct_answer": "Letra do gabarito oficial",
  "explanation": "Explicação do gabarito oficial",
  "difficulty": "Médio",
  "theme": "Tema específico dentro da matéria",
  "subject": "EIPS-CHQAO",
  "topic": "Concurso AAAA", // Onde AAAA é o ano da prova
  "is_previous_exam": true,
  "exam_year": AAAA // Ano numérico da prova
}

## 2. GERAÇÃO DE QUESTÕES INÉDITAS
Use esta estrutura para novas questões:
{
  "text": "Enunciado criado seguindo o padrão CHQAO",
  "option_a": "Alternativa A criada",
  "option_b": "Alternativa B criada",
  "option_c": "Alternativa C criada",
  "option_d": "Alternativa D criada",
  "option_e": "Alternativa E criada",
  "correct_answer": "Letra da alternativa correta",
  "explanation": "Explicação detalhada da resposta",
  "difficulty": "Fácil|Médio|Difícil",
  "theme": "Tema específico dentro da matéria",
  "subject": "EIPS-CHQAO",
  "topic": "Questão Inédita",
  "is_previous_exam": false,
  "exam_year": null
}

## 3. MATÉRIAS AUTORIZADAS
1. Língua Portuguesa
2. Geografia do Brasil
3. História do Brasil
4. E-1 - Estatuto dos Militares
5. Licitações e Contratos
6. Regulamento de Administração do Exército (RAE)
7. Direito Militar e Sindicância
8. Código Penal Militar
9. Código de Processo Penal Militar
10. Sindicância

## 4. CRITÉRIOS DE QUALIDADE

### 4.1 Regras de Formatação
- Use linguagem formal militar
- Evite questões com "EXCETO" ou "INCORRETO"
- Mantenha alternativas com comprimento similar
- Evite "todas as alternativas" ou "nenhuma das alternativas"
- Não use numeração nas alternativas
- Não inclua "A)", "B)", etc. no início das alternativas

### 4.2 Regras de Conteúdo
- Baseie-se estritamente no conteúdo fornecido
- Distribua as questões entre diferentes níveis de dificuldade
- Evite questões com pegadinhas ou ambiguidades
- Inclua explicações detalhadas e fundamentadas
- Mantenha o foco em conceitos importantes
- Evite questões que dependam de memorização de números

### 4.3 Níveis de Dificuldade
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

## 5. VALIDAÇÕES OBRIGATÓRIAS
✓ Certifique-se que existe apenas uma resposta correta
✓ Verifique se todas as alternativas são plausíveis
✓ Confirme se a explicação justifica claramente a resposta
✓ Garanta que o tema e tópico estão alinhados com o conteúdo
✓ Verifique se o nível de dificuldade está adequado
✓ Confirme se o JSON está válido e completo

## 6. OBSERVAÇÕES IMPORTANTES
- Para provas anteriores: transcrição LITERAL é obrigatória
- Para novas questões: mantenha o padrão CHQAO
- Mantenha atualidade do conteúdo quando gerar novas questões
- Considere o nível do concurso
- Evite questões que dependam de memorização de números específicos

Use a função generate_question para cada questão, garantindo que todos os campos obrigatórios sejam preenchidos corretamente.`;

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
      },
      exam_year: {
        type: ["number", "null"],
        description: "Ano da prova (apenas para questões de provas anteriores)"
      }
    },
    required: [
      "text", 
      "option_a", 
      "option_b", 
      "option_c", 
      "option_d", 
      "option_e", 
      "correct_answer", 
      "explanation", 
      "difficulty", 
      "topic", 
      "theme", 
      "subject", 
      "is_previous_exam", 
      "exam_year"
    ]
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
              content: SYSTEM_PROMPT
            },
            { 
              role: 'user', 
              content: `Matéria: ${subject}\nTema: ${theme}\n\nConteúdo:\n${pdfText}${
                customInstructions ? `\n\nInstruções adicionais: ${customInstructions}` : ''
              }` 
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
            is_ai_generated: !functionArgs.is_previous_exam,
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