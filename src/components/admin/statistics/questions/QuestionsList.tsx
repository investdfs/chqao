import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, EyeOff } from "lucide-react";

interface QuestionsListProps {
  questions: any[];
  onQuestionSelect: (question: any) => void;
}

export const QuestionsList = ({ questions, onQuestionSelect }: QuestionsListProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [hiddenQuestions, setHiddenQuestions] = useState<string[]>([]);

  const handleCheckboxChange = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleHideQuestion = (questionId: string) => {
    setHiddenQuestions(prev => [...prev, questionId]);
  };

  useEffect(() => {
    console.log("Questions loaded:", questions.length);
    console.log("Selected questions:", selectedQuestions);
  }, [questions, selectedQuestions]);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {questions.map((question) => (
        <div 
          key={question.id} 
          className={`p-4 border rounded-lg transition-colors ${
            hiddenQuestions.includes(question.id) 
              ? 'bg-red-50 border-red-200' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <Checkbox
              checked={selectedQuestions.includes(question.id)}
              onCheckedChange={() => handleCheckboxChange(question.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium">{question.text}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>{question.subject}</span>
                {question.topic && <span> • {question.topic}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQuestionSelect(question)}
                title="Editar questão"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('Excluir questão:', question.id)}
                title="Excluir questão"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('Inserir nova questão')}
                title="Inserir nova questão"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleHideQuestion(question.id)}
                title="Ocultar questão"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};