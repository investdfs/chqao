import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExcelTemplateSection } from "../ExcelTemplateSection";
import { FileUploadSection } from "../FileUploadSection";
import { CsvImporter } from "./CsvImporter";

export const ImporterTabs = () => {
  return (
    <Tabs defaultValue="csv" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="csv">Importar CSV</TabsTrigger>
        <TabsTrigger value="excel">Importar Excel</TabsTrigger>
      </TabsList>
      
      <TabsContent value="csv">
        <CsvImporter />
      </TabsContent>

      <TabsContent value="excel">
        <div className="space-y-4">
          <ExcelTemplateSection />
          <FileUploadSection />
        </div>
      </TabsContent>
    </Tabs>
  );
};