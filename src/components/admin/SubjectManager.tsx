import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { useSubjectManager } from "./manager/useSubjectManager";
import { SubjectsTable } from "./manager/SubjectsTable";

export const SubjectManager = () => {
  const {
    selectedSubject,
    setSelectedSubject,
    newSubject,
    setNewSubject,
    newTopic,
    setNewTopic,
    showSubjects,
    setShowSubjects,
    handleAddSubject,
    handleAddTopic
  } = useSubjectManager();

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Matérias e Tópicos</span>
          <Button onClick={() => setShowSubjects(!showSubjects)}>
            <Eye className="h-4 w-4 mr-2" />
            {showSubjects ? "Ocultar" : "Ver Matérias"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSubjects ? (
          <div className="space-y-4">
            <SubjectsTable />
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