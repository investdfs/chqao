import { memo, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "./QuestionMetadata";
import QuestionOptions from "./QuestionOptions";
import NavigationButtons from "./NavigationButtons";
import QuestionFeedback from "./QuestionFeedback";
import MobileFeedbackDialog from "./MobileFeedbackDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface QuestionContentProps {
  question: {
    id: string;
    text: string;
    subject?: string;
    topic?: string;
    source?: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string;
    explanation: string;
    exam_year?: number;
    is_from_previous_exam?: boolean;
  };
  selectedAnswer: string;
  setSelectedAnswer: (value: string) => void;
  hasAnswered: boolean;
  handleAnswer: () => void;
  handleReset: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
  showQuestionId?: boolean;
}

const QuestionContent = memo(({
  question,
  selectedAnswer,
  setSelectedAnswer,
  hasAnswered,
  handleAnswer,
  handleReset,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
  showQuestionId = false,
}: QuestionContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileFeedback, setShowMobileFeedback] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  console.log("Rendering QuestionContent with question:", question);

  const options = [
    { id: "A", text: question.option_a },
    { id: "B", text: question.option_b },
    { id: "C", text: question.option_c },
    { id: "D", text: question.option_d },
    { id: "E", text: question.option_e },
  ];

  const handleAnswerWithDelay = async () => {
    console.log("Iniciando processo de resposta com delay");
    setIsAnswering(true);
    handleAnswer();
    
    if (isMobile) {
      console.log("Aguardando 3 segundos antes de mostrar feedback");
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowMobileFeedback(true);
    }
    setIsAnswering(false);
  };

  useEffect(() => {
    if (hasAnswered && isMobile && !isAnswering) {
      console.log("Mostrando feedback após delay");
      setShowMobileFeedback(true);
    }
  }, [hasAnswered, isMobile, isAnswering]);

  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
            examYear={question.exam_year}
            isFromPreviousExam={question.is_from_previous_exam}
            showId={showQuestionId}
          />

          <div className="text-base dark:text-gray-200 text-left">
            {question.text}
          </div>

          <QuestionOptions
            options={options}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            correctAnswer={question.correct_answer}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
          />

          <NavigationButtons
            onPrevious={onPreviousQuestion}
            onNext={onNextQuestion}
            onAnswer={handleAnswerWithDelay}
            canAnswer={!!selectedAnswer}
            hasAnswered={hasAnswered}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            isAnswering={isAnswering}
          />

          {hasAnswered && !isMobile && (
            <QuestionFeedback
              isCorrect={selectedAnswer === question.correct_answer}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correct_answer}
              explanation={question.explanation}
              onReset={handleReset}
              questionId={question.id}
            />
          )}

          <MobileFeedbackDialog
            open={showMobileFeedback}
            onOpenChange={setShowMobileFeedback}
            isCorrect={selectedAnswer === question.correct_answer}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.correct_answer}
            explanation={question.explanation}
            onNext={onNextQuestion}
            onPrevious={onPreviousQuestion}
            canGoNext={questionNumber < totalQuestions}
            canGoPrevious={questionNumber > 1}
          />
        </div>
      </CardContent>
    </Card>
  );
});

QuestionContent.displayName = 'QuestionContent';

export default QuestionContent;