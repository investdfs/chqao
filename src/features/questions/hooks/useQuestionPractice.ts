import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useQuestionPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  
  // Dados mockados para desenvolvimento local
  const mockQuestions = [
    {
      id: "1",
      subject: "História",
      topic: "Brasil República",
      text: "Qual foi a última frase de Getúlio Vargas?",
      option_a: "\"Saio da vida para entrar na história.\"",
      option_b: "\"Deixo a vida para entrar na imortalidade.\"",
      option_c: "\"Luttei contra a espoliação do Brasil.\"",
      option_d: "\"Vencerei a morte com meu ideal de um Brasil justo e soberano.\"",
      option_e: "\"Lutei pelo povo e pelo país.\"",
      correct_answer: "A",
      explanation: "A frase \"Saio da vida para entrar na história\" foi escrita por Getúlio Vargas em sua carta-testamento.",
      difficulty: "Médio"
    },
    // Adicione mais questões mockadas conforme necessário
  ];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return {
    currentQuestionIndex,
    questions: mockQuestions,
    isLoadingQuestions: false,
    error: null,
    handleNextQuestion,
    handlePreviousQuestion
  };
};