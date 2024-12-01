import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubjectSelect } from "./SubjectSelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UrlImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UrlImportDialog = ({ open, onOpenChange }: UrlImportDialogProps) => {
  const [url, setUrl] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!url || !selectedSubject || !selectedTheme) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Iniciando processamento da URL:', url);

      const { error: functionError } = await supabase.functions.invoke('process-url', {
        body: { 
          url,
          subject: selectedSubject,
          theme: selectedTheme
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Processamento iniciado",
        description: "O conteúdo está sendo processado. Aguarde a conclusão.",
      });

      onOpenChange(false);
      setUrl('');
      setSelectedSubject('');
      setSelectedTheme('');

    } catch (error) {
      console.error('Erro ao processar URL:', error);
      toast({
        title: "Erro ao processar URL",
        description: "Ocorreu um erro durante o processamento.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar via URL</DialogTitle>
          <DialogDescription>
            Insira a URL de uma tabela ou PDF online para importar questões.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Documento</label>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Matéria</label>
            <SubjectSelect
              type="subject"
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tema</label>
            <SubjectSelect
              type="theme"
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              subjectFilter={selectedSubject}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};