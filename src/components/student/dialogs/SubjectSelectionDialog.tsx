import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SubjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubjectSelect: (subject: string) => void;
}

const subjects = [
  "Língua Portuguesa",
  "Geografia do Brasil",
  "História do Brasil",
  "Estatuto dos Militares",
  "Licitações e Contratos",
  "Regulamento de Administração do Exército (RAE)",
  "Direito Militar e Sindicância no Âmbito do Exército Brasileiro",
  "Código Penal Militar",
  "Código de Processo Penal Militar"
];

export const SubjectSelectionDialog = ({
  open,
  onOpenChange,
  onSubjectSelect
}: SubjectSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Selecione a matéria para estudar
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] mt-4">
          <div className="flex flex-col gap-2 p-4">
            {subjects.map((subject, index) => (
              <Button
                key={subject}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 hover:bg-primary/10"
                onClick={() => onSubjectSelect(subject)}
              >
                <span className="mr-2">{index + 1}.</span>
                {subject}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};