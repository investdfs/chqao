import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil } from "lucide-react";

// Lista de matérias disponíveis (em uma aplicação real, viria do banco de dados)
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
    topics: ["Brasil Colônia", "Idade Média", "Segunda Guerra"]
  },
];

export const SubjectManager = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [showSubjects, setShowSubjects] = useState(false);

  const handleAddSubject = () => {
    if (newSubject) {
      toast({
        title: "Matéria adicionada",
        description: `A matéria ${newSubject} foi adicionada com sucesso.`,
      });
      setNewSubject("");
    }
  };

  const handleAddTopic = () => {
    if (selectedSubject && newTopic) {
      toast({
        title: "Tópico adicionado",
        description: `O tópico ${newTopic} foi adicionado à matéria ${selectedSubject}.`,
      });
      setNewTopic("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Matérias e Tópicos</span>
          <Button onClick={() => setShowSubjects(!showSubjects)}>
            <Eye className="h-4 w-4 mr-2" />
            {showSubjects ? "Ocultar" : "Ver Cadastrados"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSubjects ? (
          <div className="space-y-4">
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
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Input
                placeholder="Nome da nova matéria"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <Button className="w-full" onClick={handleAddSubject}>
                Adicionar Matéria
              </Button>
            </div>

            <div className="space-y-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Nome do novo tópico"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />
              <Button className="w-full" onClick={handleAddTopic}>
                Adicionar Tópico
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};