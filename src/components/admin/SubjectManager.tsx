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
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {availableSubjects.sort((a, b) => a.name.localeCompare(b.name)).map((subject) => (
                    <SelectItem 
                      key={subject.id} 
                      value={subject.name}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
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
    name: "Língua Portuguesa",
    theme: "Conhecimentos Gerais",
    topics: []
  },
  { 
    id: "2", 
    name: "Geografia do Brasil",
    theme: "Conhecimentos Gerais",
    topics: []
  },
  { 
    id: "3", 
    name: "História do Brasil",
    theme: "Conhecimentos Gerais",
    topics: []
  },
  { 
    id: "4", 
    name: "Estatuto dos Militares",
    theme: "Conhecimentos Profissionais",
    topics: []
  },
  { 
    id: "5", 
    name: "Licitações e Contratos",
    theme: "Conhecimentos Profissionais",
    topics: []
  },
  { 
    id: "6", 
    name: "Regulamento de Administração do Exército (RAE)",
    theme: "Conhecimentos Profissionais",
    topics: []
  },
  { 
    id: "7", 
    name: "Direito Militar e Sindicância no Âmbito do Exército Brasileiro",
    theme: "Conhecimentos Profissionais",
    topics: []
  },
  { 
    id: "8", 
    name: "Código Penal Militar",
    theme: "Conhecimentos Profissionais",
    topics: []
  },
  { 
    id: "9", 
    name: "Código de Processo Penal Militar",
    theme: "Conhecimentos Profissionais",
    topics: []
  }
].sort((a, b) => a.name.localeCompare(b.name));