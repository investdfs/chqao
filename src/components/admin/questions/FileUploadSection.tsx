import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

export const FileUploadSection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const processExcelFile = async (file: File) => {
    console.log('Iniciando processamento do arquivo Excel');
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`Processando ${jsonData.length} questões...`);
      const insertedQuestions = [];

      for (const row of jsonData) {
        if (!row['Matéria'] || !row['Questão']) continue; // Skip empty rows

        const question = {
          subject: row['Matéria'],
          theme: row['Tema'],
          topic: row['Assunto'],
          text: row['Questão'],
          image_url: row['URL da Imagem'] || null,
          option_a: row['Opção A'],
          option_b: row['Opção B'],
          option_c: row['Opção C'],
          option_d: row['Opção D'],
          option_e: row['Opção E'],
          correct_answer: row['Resposta Correta'],
          explanation: row['Explicação'] || null,
          difficulty: row['Dificuldade'] || 'Médio',
          is_from_previous_exam: row['Questão de Concurso Anterior?'] === 'Sim',
          exam_year: row['Ano do Concurso'] ? parseInt(row['Ano do Concurso']) : null,
          exam_name: row['Nome do Concurso'] || null
        };

        console.log(`Inserindo questão: ${question.text.substring(0, 50)}...`);
        
        const { data, error } = await supabase
          .from('questions')
          .insert([question])
          .select();

        if (error) {
          console.error('Erro ao inserir questão:', error);
          throw error;
        }

        if (data) {
          insertedQuestions.push(data[0]);
        }
      }

      console.log(`Processamento concluído. ${insertedQuestions.length} questões inseridas.`);
      return insertedQuestions;
    } catch (error) {
      console.error('Erro ao processar arquivo Excel:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Iniciando upload do arquivo:", file.name);
    setIsUploading(true);
    toast({
      title: "Processando arquivo",
      description: "Aguarde enquanto importamos as questões...",
    });

    try {
      const insertedQuestions = await processExcelFile(file);
      console.log("Questões processadas com sucesso:", insertedQuestions);

      toast({
        title: "Sucesso!",
        description: `${insertedQuestions.length} questões foram importadas com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro ao importar questões",
        description: "Verifique se o arquivo está no formato correto e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept=".xls,.xlsx"
        className="hidden"
        id="file-upload"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer flex flex-col items-center space-y-2 ${
          isUploading ? "opacity-50" : ""
        }`}
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processando arquivo...</span>
          </div>
        ) : (
          <>
            <span className="text-sm text-gray-600">
              Clique para fazer upload ou arraste um arquivo
            </span>
            <span className="text-xs text-gray-400">Suporta arquivos Excel (.xls, .xlsx)</span>
          </>
        )}
      </label>
    </div>
  );
};