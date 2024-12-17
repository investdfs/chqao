import { Button } from "@/components/ui/button";
import { useQuestionBulkUpdate } from "./useQuestionBulkUpdate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface BulkActionButtonsProps {
  selectedQuestions: string[];
  onSuccess?: () => void;
}

const SUBJECTS = [
  'Língua Portuguesa',
  'Geografia do Brasil',
  'História do Brasil',
  'Estatuto dos Militares',
  'Licitações e Contratos',
  'Regulamento de Administração do Exército (RAE)',
  'Direito Militar e Sindicância no Âmbito do Exército Brasileiro',
  'Código Penal Militar',
  'Código de Processo Penal Militar'
] as const;

export const BulkActionButtons = ({ selectedQuestions, onSuccess }: BulkActionButtonsProps) => {
  const { updateQuestionsSubject } = useQuestionBulkUpdate();
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleUpdateSubject = async () => {
    if (!selectedSubject) {
      return;
    }
    const success = await updateQuestionsSubject(selectedQuestions, selectedSubject);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  if (!selectedQuestions.length) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedQuestions.length} questões selecionadas
      </span>
      <Select
        value={selectedSubject}
        onValueChange={setSelectedSubject}
      >
        <SelectTrigger className="w-[280px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="Selecione a matéria" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
          {SUBJECTS.map((subject) => (
            <SelectItem 
              key={subject} 
              value={subject}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={handleUpdateSubject}
        disabled={!selectedSubject}
      >
        Atualizar matéria
      </Button>
    </div>
  );
};