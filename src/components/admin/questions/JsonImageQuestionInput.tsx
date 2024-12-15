import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { JsonImageDialog } from "./json-image/JsonImageDialog";
import { useJsonImageQuestions } from "./json-image/useJsonImageQuestions";

export const JsonImageQuestionInput = () => {
  const {
    open,
    setOpen,
    jsonInput,
    setJsonInput,
    isLoading,
    subject,
    setSubject,
    topic,
    setTopic,
    imageUrl,
    setImageUrl,
    handleSubmit,
    resetForm
  } = useJsonImageQuestions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#221F26] hover:bg-[#221F26]/90">
          <ImageIcon className="mr-2 h-4 w-4" />
          Inserir Questões com Imagem via JSON
        </Button>
      </DialogTrigger>

      <JsonImageDialog
        subject={subject}
        topic={topic}
        jsonInput={jsonInput}
        imageUrl={imageUrl}
        isLoading={isLoading}
        onSubjectChange={setSubject}
        onTopicChange={setTopic}
        onJsonChange={setJsonInput}
        onImageChange={setImageUrl}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
    </Dialog>
  );
};