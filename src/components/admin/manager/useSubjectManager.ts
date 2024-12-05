import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useSubjectManager = () => {
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

  return {
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
  };
};