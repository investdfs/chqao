import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PdfUploadCard } from '@/components/test/PdfUploadCard';
import { GenerationsList } from '@/components/test/GenerationsList';
import { QuestionsStats } from '@/components/test/QuestionsStats';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UploadedPdfsList } from '@/components/test/UploadedPdfsList';

type SelectedPdf = {
  id: string;
  filename: string;
  file_path: string;
  subject: string | null;
};

const TestDashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<SelectedPdf | null>(null);

  console.log('TestDashboard - Selected PDF:', selectedPdf); // Debug log

  const handlePdfSelect = (pdf: SelectedPdf | null) => {
    console.log('PDF selecionado:', pdf);
    setSelectedPdf(pdf);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Testes - IA</h1>
          <Button variant="outline" onClick={() => navigate("/admin-dashboard")}>
            Voltar
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PdfUploadCard selectedPdf={selectedPdf} onPdfSelect={handlePdfSelect} />
            <UploadedPdfsList onSelectPdf={handlePdfSelect} />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <QuestionsStats />
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-100 rounded-lg">
                  <span className="text-lg font-semibold">Histórico de Gerações</span>
                  <svg
                    className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;