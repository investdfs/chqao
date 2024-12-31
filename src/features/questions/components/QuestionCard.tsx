import React, { useState, useEffect } from "react";
import { QuestionContent } from "./question/QuestionContent";
import { BlockedUserCard } from "./question/BlockedUserCard";
import { useQuestion } from "@/contexts/QuestionContext";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
}) => {
  console.log("Renderizando QuestionCard para questão:", question.id);

  // Estado local para estatísticas da sessão
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  });

  // Estados locais para controle da resposta
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);

  // Reset do estado quando a questão muda
  useEffect(() => {
    console.log("Question ID mudou, resetando estado");
    setSelectedAnswer("");
    setHasAnswered(false);
  }, [question.id]);

  // Função para lidar com a resposta
  const handleAnswer = () => {
    if (!hasAnswered && selectedAnswer) {
      setHasAnswered(true);
      const isCorrect = selectedAnswer === question.correct_answer;
      setSessionStats(prev => ({
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1)
      }));
    }
  };

  // Função para resetar a resposta atual
  const handleReset = () => {
    setSelectedAnswer("");
    setHasAnswered(false);
  };

  if (isUserBlocked) {
    return <BlockedUserCard />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-auto">
      <QuestionContent
        question={question}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        hasAnswered={hasAnswered}
        handleAnswer={handleAnswer}
        handleReset={handleReset}
        sessionStats={sessionStats}
        onNextQuestion={onNextQuestion}
        onPreviousQuestion={onPreviousQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    </div>
  );
};

export default QuestionCard;