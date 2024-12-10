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
    options: Array<{ id: string; text: string }>;
    correctAnswer: string;
    explanation: string;
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
}: QuestionContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileFeedback, setShowMobileFeedback] = useState(false);

  useEffect(() => {
    if (hasAnswered && isMobile) {
      setShowMobileFeedback(true);
    }
  }, [hasAnswered, isMobile]);

  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
          />

          <div className="text-base dark:text-gray-200 text-left">
            {question.text}
          </div>

          <QuestionOptions
            options={question.options}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            correctAnswer={question.correctAnswer}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
          />

          <NavigationButtons
            onPrevious={onPreviousQuestion}
            onNext={onNextQuestion}
            onAnswer={handleAnswer}
            canAnswer={!!selectedAnswer}
            hasAnswered={hasAnswered}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
          />

          {hasAnswered && !isMobile && (
            <QuestionFeedback
              isCorrect={selectedAnswer === question.correctAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correctAnswer}
              explanation={question.explanation}
              onReset={handleReset}
              questionId={question.id}
            />
          )}

          <MobileFeedbackDialog
            open={showMobileFeedback}
            onOpenChange={setShowMobileFeedback}
            isCorrect={selectedAnswer === question.correctAnswer}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.correctAnswer}
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