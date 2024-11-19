import { useState } from "react";
import QuestionCard from "@/components/student/QuestionCard";

const MOCK_QUESTIONS = [
  {
    id: 1,
    subject: "Geografia",
    topic: "Relevo",
    text: "Qual é a forma de Mares de Morro: Pampas",
    options: [
      { id: "A", text: "Pampas" },
      { id: "B", text: "Serrado" },
      { id: "C", text: "Planicies" },
      { id: "D", text: "Planaltos" },
    ],
    correctAnswer: "A",
    explanation: "Esta é a aplicação",
  },
  {
    id: 2,
    subject: "Geografia 2",
    topic: "Relevo",
    text: "Qual é a forma de Mares de Morro: Pampas",
    options: [
      { id: "A", text: "Pampas" },
      { id: "B", text: "Serrado" },
      { id: "C", text: "Planicies" },
      { id: "D", text: "Planaltos" },
    ],
    correctAnswer: "A",
    explanation: "Esta é a aplicação",
  },
  {
    id: 3,
    subject: "Geografia 3",
    topic: "Relevo",
    text: "Qual é a forma de Mares de Morro: Pampas",
    options: [
      { id: "A", text: "Pampas" },
      { id: "B", text: "Serrado" },
      { id: "C", text: "Planicies" },
      { id: "D", text: "Planaltos" },
    ],
    correctAnswer: "A",
    explanation: "Esta é a aplicação",
  },
  {
    id: 4,
    subject: "Geografia 4",
    topic: "Relevo",
    text: "Qual é a forma de Mares de Morro: Pampas",
    options: [
      { id: "A", text: "Pampas" },
      { id: "B", text: "Serrado" },
      { id: "C", text: "Planicies" },
      { id: "D", text: "Planaltos" },
    ],
    correctAnswer: "A",
    explanation: "Esta é a aplicação",
  },
];

const QuestionPractice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          question={MOCK_QUESTIONS[currentQuestionIndex]}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={MOCK_QUESTIONS.length}
        />
      </div>
    </div>
  );
};

export default QuestionPractice;