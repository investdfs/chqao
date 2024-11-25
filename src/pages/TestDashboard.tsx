import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PdfUploadCard } from '@/components/test/PdfUploadCard';
import { GenerationsList } from '@/components/test/GenerationsList';
import { QuestionsStats } from '@/components/test/QuestionsStats';
import { UploadedPdfsList } from '@/components/test/UploadedPdfsList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const TestDashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Testes - IA</h1>
          <Button variant="outline" onClick={() => navigate("/admin-dashboard")}>
            Voltar
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            <PdfUploadCard />
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            <UploadedPdfsList 
              onSelectPdf={(pdf) => {
                // This will be handled by PdfUploadCard
                console.log('Selected PDF:', pdf);
              }} 
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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