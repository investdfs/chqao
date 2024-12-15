import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: topics } = useQuery({
    queryKey: ['subject-structure-topics', questionData.subject],
    queryFn: async () => {
      if (!questionData.subject) return [];

      console.log('Buscando tópicos do banco...');
      const parentNode = await supabase
        .from('subject_structure')
        .select('id')
        .eq('name', questionData.subject)
        .single();

      if (!parentNode.data) return [];

      const { data, error } = await supabase
        .from('subject_structure')
        .select('name')
        .eq('parent_id', parentNode.data.id)
        .order('name');

      if (error) throw error;
      return data.map(item => item.name);
    },
    enabled: !!questionData.subject
  });

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
          <div className="flex gap-2">
            <Select
              value={questionData.topic}
              onValueChange={(value) => onInputChange("topic", value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione o tópico" />
              </SelectTrigger>
              <SelectContent>
                {topics?.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Ou digite um novo tópico"
              value={!topics?.includes(questionData.topic) ? questionData.topic : ""}
              onChange={(e) => onInputChange("topic", e.target.value)}
              className="flex-1"
            />
          </div>
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
    </div>
  );
};