import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PdfUploadCard } from '@/components/test/PdfUploadCard';
import { GenerationsList } from '@/components/test/GenerationsList';
import { QuestionsStats } from '@/components/test/QuestionsStats';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UploadedPdfsList } from '@/components/test/UploadedPdfsList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

type SelectedPdf = {
  id: string;
  filename: string;
  file_path: string;
  subject: string | null;
  theme: string | null;
};

const TestDashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);

  console.log('TestDashboard - Selected PDF:', selectedPdf);

  const handlePdfSelect = (pdf: SelectedPdf | null) => {
    console.log('PDF selecionado:', pdf);
    setSelectedPdf(pdf);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin-dashboard")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerador de Questões - IA
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {selectedPdf ? selectedPdf.filename : 'Nenhum PDF selecionado'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* PDF Upload and List Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PdfUploadCard selectedPdf={selectedPdf} onPdfSelect={handlePdfSelect} />
            <UploadedPdfsList onSelectPdf={handlePdfSelect} />
          </div>
          
          {/* Statistics and History Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <QuestionsStats />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Histórico de Gerações</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">
                        {isOpen ? 'Ocultar histórico' : 'Mostrar histórico'}
                      </span>
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <GenerationsList 
                      generations={[]} 
                      onViewQuestions={() => {}}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;