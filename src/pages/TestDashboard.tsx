import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PdfUploadCard } from '@/components/test/PdfUploadCard';
import { GenerationsList } from '@/components/test/GenerationsList';
import { QuestionsStats } from '@/components/test/QuestionsStats';

const TestDashboard = () => {
  const navigate = useNavigate();

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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <PdfUploadCard />
            <QuestionsStats />
          </div>
          <GenerationsList 
            generations={[]} 
            onViewQuestions={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;