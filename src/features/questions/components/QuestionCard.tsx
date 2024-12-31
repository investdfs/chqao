import React, { useState, useEffect } from "react";
import QuestionContent from "./question/QuestionContent";
import BlockedUserCard from "./question/BlockedUserCard";
import { useQuestion } from "@/contexts/QuestionContext";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: QuestionOption[];
    correctAnswer: string;
    explanation: string;
  };
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  isUserBlocked?: boolean;
  showQuestionId?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  isUserBlocked = false,
  showQuestionId = false,
}) => {
  console.log("Renderizando QuestionCard para questão:", question.id);

  // Estado local para as estatísticas da sessão atual (temporário)
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
      const isCorrect = selectedAnswer === question.correctAnswer;
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
    <div className="space-y-6">
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
        showQuestionId={showQuestionId}
      />
    </div>
  );
};

export default QuestionCard;