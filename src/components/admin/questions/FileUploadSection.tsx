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
      const insertedQuestions = [];

      for (const sheetName of workbook.SheetNames) {
        if (sheetName === 'Instruções') continue;
        
        console.log(`Processando aba: ${sheetName}`);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row
        for (let i = 1; i < jsonData.length; i++) {
          const row: any = jsonData[i];
          if (!row[0]) continue; // Skip empty rows

          const question = {
            theme: row[0],
            subject_matter: row[1],
            text: row[2],
            image_url: row[3] || null,
            option_a: row[4],
            option_b: row[5],
            option_c: row[6],
            option_d: row[7],
            option_e: row[8],
            correct_answer: row[9],
            explanation: row[10] || null,
            difficulty: row[11] || 'Médio',
            is_from_previous_exam: row[12] === 'Sim',
            exam_year: row[13] ? parseInt(row[13]) : null,
            exam_name: row[14] || null,
            subject: sheetName
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
        accept=".csv,.xlsx"
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
            <span className="text-xs text-gray-400">Suporta arquivos CSV e Excel</span>
          </>
        )}
      </label>
    </div>
  );
};