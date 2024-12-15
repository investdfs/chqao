import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubjectTopicFields } from "./SubjectTopicFields";
import { ImageUploadField } from "./ImageUploadField";
import { QuestionOptionsFields } from "./QuestionOptionsFields";

interface QuestionFormFieldsProps {
  questionData: {
    subject: string;
    topic: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
    image_url?: string;
  };
  onInputChange: (field: string, value: string) => void;
  isGenerating?: boolean;
  onGenerateAlternatives?: () => void;
}

export const QuestionFormFields = ({
  questionData,
  onInputChange,
  isGenerating,
  onGenerateAlternatives
}: QuestionFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <SubjectTopicFields
        subject={questionData.subject}
        topic={questionData.topic}
        onInputChange={onInputChange}
      />

      <ImageUploadField
        imageUrl={questionData.image_url}
        onImageChange={(url) => onInputChange('image_url', url)}
      />

      <div className="space-y-2">
        <Label htmlFor="text">Texto da Questão *</Label>
        <Textarea
          id="text"
          value={questionData.text}
          onChange={(e) => onInputChange("text", e.target.value)}
          placeholder="Digite o texto da questão aqui..."
          className="min-h-[100px]"
        />
      </div>

      <QuestionOptionsFields
        options={{
          option_a: questionData.option_a,
          option_b: questionData.option_b,
          option_c: questionData.option_c,
          option_d: questionData.option_d,
          option_e: questionData.option_e,
        }}
        correctAnswer={questionData.correct_answer}
        onInputChange={onInputChange}
      />

      <div className="space-y-2">
        <Label htmlFor="explanation">Explicação (opcional)</Label>
        <Textarea
          id="explanation"
          value={questionData.explanation}
          onChange={(e) => onInputChange("explanation", e.target.value)}
          placeholder="Digite a explicação da resposta correta..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};