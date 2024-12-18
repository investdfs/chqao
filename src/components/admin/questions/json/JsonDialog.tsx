import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubjectTopicFields } from "../form/SubjectTopicFields";
import { WandIcon } from "lucide-react";

interface JsonDialogProps {
  subject: string;
  topic: string;
  jsonInput: string;
  isLoading: boolean;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onJsonChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const JsonDialog = ({
  subject,
  topic,
  jsonInput,
  isLoading,
  onSubjectChange,
  onTopicChange,
  onJsonChange,
  onSubmit,
  onCancel
}: JsonDialogProps) => {
  const handleFormatJson = () => {
    try {
      // Tenta fazer o parse do JSON atual
      let parsedJson = JSON.parse(jsonInput);
      
      // Se for um objeto único, converte para array
      if (!Array.isArray(parsedJson)) {
        parsedJson = [parsedJson];
      }

      // Garante que todos os campos obrigatórios estejam presentes
      const formattedQuestions = parsedJson.map((q: any) => ({
        questao: q.questao || "",
        opcao_a: q.opcao_a || "",
        opcao_b: q.opcao_b || "",
        opcao_c: q.opcao_c || "",
        opcao_d: q.opcao_d || "",
        opcao_e: q.opcao_e || "",
        resposta_correta: q.resposta_correta || "A",
        comentario: q.comentario || "",
        nivel: q.nivel || "Médio",
        materia: q.materia || subject || "",
        assunto: q.assunto || topic || "",
        tipo: q.tipo || "Questão Inédita",
        questao_de_prova_anterior: q.questao_de_prova_anterior || "nao",
        ano_exame: q.ano_exame || null,
        status: "active"
      }));

      // Atualiza o JSON com a versão formatada
      onJsonChange(JSON.stringify(formattedQuestions, null, 2));
    } catch (error) {
      console.error("Erro ao formatar JSON:", error);
      // Se houver erro no parse, tenta limpar caracteres especiais comuns
      const cleanedJson = jsonInput
        .replace(/[\u201C\u201D]/g, '"') // Substitui aspas especiais
        .replace(/[\u2018\u2019]/g, "'") // Substitui apóstrofos especiais
        .replace(/\n/g, "\\n") // Escapa quebras de linha
        .trim();
      
      onJsonChange(cleanedJson);
    }
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Inserir Questões via JSON</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-4">
          <SubjectTopicFields
            subject={subject}
            topic={topic}
            onInputChange={(field, value) => {
              if (field === "subject") onSubjectChange(value);
              if (field === "topic") onTopicChange(value);
            }}
            isOptional={true}
            helperText="Estes campos são opcionais e serão usados apenas se não estiverem definidos no JSON. No JSON, 'theme' é a matéria principal e 'subject' é o assunto específico."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="json">JSON das Questões *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFormatJson}
              disabled={isLoading}
            >
              <WandIcon className="mr-2 h-4 w-4" />
              Corrigir Formatação
            </Button>
          </div>
          <Textarea
            id="json"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder={`Cole aqui o JSON das questões...

Exemplo de estrutura:
{
  "questao": "Qual foi um dos principais focos de atuação do Partido Liberal?",
  "opcao_a": "Conservação da escravidão.",
  "opcao_b": "Apoio à abolição do escravismo.",
  "opcao_c": "Estabelecimento de uma monarquia divina.",
  "opcao_d": "Estagnação do comércio.",
  "opcao_e": "Apoio às potências europeias.",
  "resposta_correta": "B",
  "comentario": "O Partido Liberal promoveu discussões sobre a abolição do escravismo e a modernização de instituições.",
  "nivel": "Médio",
  "materia": "História do Brasil",
  "assunto": "Os Partidos Políticos",
  "tipo": "Questão Inédita",
  "questao_de_prova_anterior": "nao",
  "ano_exame": null,
  "status": "active"
}`}
            className="min-h-[300px] font-mono"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading || !jsonInput.trim()}
        >
          {isLoading ? "Processando..." : "Inserir Questões"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};