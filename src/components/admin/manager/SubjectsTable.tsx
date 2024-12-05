import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const availableSubjects = [
  { 
    id: "1", 
    name: "Matemática",
    topics: ["Álgebra", "Geometria", "Trigonometria"]
  },
  { 
    id: "2", 
    name: "Português",
    topics: ["Gramática", "Literatura", "Redação"]
  },
  { 
    id: "3", 
    name: "História",
    topics: []
  },
];

export const SubjectsTable = () => {
  const { toast } = useToast();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Matéria</TableHead>
          <TableHead>Tópicos</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {availableSubjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell>{subject.name}</TableCell>
            <TableCell>{subject.topics.join(", ")}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Matéria e Tópicos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label>Nome da Matéria</label>
                      <Input defaultValue={subject.name} />
                    </div>
                    <div className="space-y-2">
                      <label>Tópicos (separados por vírgula)</label>
                      <Input defaultValue={subject.topics.join(", ")} />
                    </div>
                    <Button className="w-full" onClick={() => {
                      toast({
                        title: "Matéria atualizada",
                        description: "As alterações foram salvas com sucesso.",
                      });
                    }}>
                      Salvar Alterações
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};