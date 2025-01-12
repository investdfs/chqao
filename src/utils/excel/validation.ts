import { z } from "zod";

const difficultyEnum = z.enum(["Fácil", "Médio", "Difícil"]);

export const questionSchema = z.object({
  tema: z.string().min(1, "Tema é obrigatório"),
  assunto: z.string().min(1, "Assunto é obrigatório"),
  questao: z.string().min(1, "Questão é obrigatória"),
  imagem: z.string().nullable().optional(),
  opcaoA: z.string().min(1, "Opção A é obrigatória"),
  opcaoB: z.string().min(1, "Opção B é obrigatória"),
  opcaoC: z.string().min(1, "Opção C é obrigatória"),
  opcaoD: z.string().min(1, "Opção D é obrigatória"),
  opcaoE: z.string().min(1, "Opção E é obrigatória"),
  resposta: z.string().refine(val => /^[A-E]$/.test(val), {
    message: "Resposta deve ser A, B, C, D ou E"
  }),
  explicacao: z.string().min(1, "Explicação é obrigatória"),
  dificuldade: difficultyEnum.default("Médio"),
  concursoAnterior: z.string().optional(),
  ano: z.number().optional(),
  nome: z.string().optional()
});

export const validateQuestionRow = (row: any[], sheetName: string) => {
  const [
    tema, assunto, questao, imagem, opcaoA, opcaoB, opcaoC, 
    opcaoD, opcaoE, resposta, explicacao, dificuldade,
    concursoAnterior, ano, nome
  ] = row;

  try {
    return questionSchema.parse({
      tema, assunto, questao, imagem, opcaoA, opcaoB, opcaoC,
      opcaoD, opcaoE, resposta, explicacao, dificuldade,
      concursoAnterior, ano, nome
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(e => e.message).join(", ");
      throw new Error(`Erro na validação: ${errors} (Aba: ${sheetName})`);
    }
    throw error;
  }
};