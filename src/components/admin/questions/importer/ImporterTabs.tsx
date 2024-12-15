import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExcelTemplateSection } from "../ExcelTemplateSection";
import { FileUploadSection } from "../FileUploadSection";
import { InsertQuestionsButton } from "../InsertQuestionsButton";
import { InsertPreviousExamQuestionsButton } from "../InsertPreviousExamQuestionsButton";

export const ImporterTabs = () => {
  return (
    <Tabs defaultValue="regular" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="regular">Questões Regulares</TabsTrigger>
        <TabsTrigger value="exams">Questões de Provas</TabsTrigger>
      </TabsList>

      <TabsContent value="regular" className="space-y-4">
        <ExcelTemplateSection />
        <FileUploadSection />
        <InsertQuestionsButton />
      </TabsContent>

      <TabsContent value="exams" className="space-y-4">
        <InsertPreviousExamQuestionsButton />
      </TabsContent>
    </Tabs>
  );
};