import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JsonDialog } from "./json/JsonDialog";
import { useJsonQuestions } from "./json/useJsonQuestions";

export const JsonQuestionInput = () => {
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
    handleSubmit,
    resetForm
  } = useJsonQuestions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">
          Inserir Questões via JSON
        </Button>
      </DialogTrigger>

      <JsonDialog
        subject={subject}
        topic={topic}
        jsonInput={jsonInput}
        isLoading={isLoading}
        onSubjectChange={setSubject}
        onTopicChange={setTopic}
        onJsonChange={setJsonInput}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
    </Dialog>
  );
};