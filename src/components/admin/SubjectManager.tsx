import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Lista de matérias disponíveis (em uma aplicação real, viria do banco de dados)
const availableSubjects = [
  { id: "1", name: "Matemática" },
  { id: "2", name: "Português" },
  { id: "3", name: "História" },
];

export const SubjectManager = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");

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
        <CardTitle>Gerenciar Matérias e Tópicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};