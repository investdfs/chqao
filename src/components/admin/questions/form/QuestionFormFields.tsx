import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, ZoomIn } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { data: subjects } = useQuery({
    queryKey: ['subject-structure-subjects'],
    queryFn: async () => {
      console.log('Buscando matérias do banco...');
      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('level', 1)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log('Uploading image:', file.name);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('question_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      console.log('Image uploaded successfully:', filePath);

      const { data: { publicUrl } } = supabase.storage
        .from('question_images')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      onInputChange('image_url', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onInputChange('image_url', '');
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Matéria *</Label>
          <Select
            value={questionData.subject}
            onValueChange={(value) => onInputChange("subject", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Tópico *</Label>
          <Input
            placeholder="Digite o tópico"
            value={questionData.topic}
            onChange={(e) => onInputChange("topic", e.target.value)}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagem da Questão (opcional)</Label>
        <div className="flex flex-col gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="bg-white dark:bg-gray-800"
          />
          {(imagePreview || questionData.image_url) && (
            <div className="relative">
              <img
                src={imagePreview || questionData.image_url}
                alt="Preview"
                className="max-h-48 object-contain cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-12"
                onClick={() => setShowImageModal(true)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

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

      <div className="space-y-4">
        <Label>Alternativas *</Label>
        {['a', 'b', 'c', 'd', 'e'].map((option) => (
          <div key={option} className="flex gap-2 items-center">
            <span className="w-6 text-center font-medium">{option.toUpperCase()}</span>
            <Input
              value={questionData[`option_${option}` as keyof typeof questionData]}
              onChange={(e) => onInputChange(`option_${option}`, e.target.value)}
              placeholder={`Digite a alternativa ${option.toUpperCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="correct_answer">Resposta Correta *</Label>
        <Select
          value={questionData.correct_answer}
          onValueChange={(value) => onInputChange("correct_answer", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a alternativa correta" />
          </SelectTrigger>
          <SelectContent>
            {['A', 'B', 'C', 'D', 'E'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <img
            src={imagePreview || questionData.image_url}
            alt="Question"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};