import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GenerationFormProps {
  questionCount: string;
  instructions: string;
  isProcessing: boolean;
  hasFile: boolean;
  onQuestionCountChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onSubmit: () => void;
}

export const GenerationForm = ({
  questionCount,
  instructions,
  isProcessing,
  hasFile,
  onQuestionCountChange,
  onInstructionsChange,
  onSubmit
}: GenerationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="questionCount">Quantidade de Questões</Label>
        <Input
          id="questionCount"
          type="number"
          min="1"
          max="50"
          value={questionCount}
          onChange={(e) => onQuestionCountChange(e.target.value)}
          placeholder="Número de questões a serem geradas"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instruções Específicas</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="Instruções específicas para a geração das questões (opcional)"
          className="min-h-[100px]"
          disabled={isProcessing}
        />
      </div>

      <Button 
        onClick={onSubmit}
        disabled={!hasFile || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processando...</span>
          </div>
        ) : (
          "Iniciar Geração"
        )}
      </Button>
    </div>
  );
};