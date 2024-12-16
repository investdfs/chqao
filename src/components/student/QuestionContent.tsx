import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "./question/QuestionMetadata";
import QuestionOptions from "@/features/questions/components/question/QuestionOptions";
import NavigationButtons from "./question/NavigationButtons";
import QuestionFeedback from "./question/QuestionFeedback";
import { QuestionFooter } from "./question/QuestionFooter";

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
    image_url?: string;
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
  studentId?: string;
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
  studentId,
}: QuestionContentProps) => {
  console.log("Renderizando QuestionContent para questão:", question.id);

  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
          />

          <div className="text-base dark:text-gray-200 text-left">
            {question.text}
            {question.image_url && (
              <div className="flex justify-center my-4">
                <img 
                  src={question.image_url} 
                  alt="Questão" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <QuestionOptions
            options={question.options}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            correctAnswer={question.correctAnswer}
            onAnswerSelect={setSelectedAnswer}
            questionId={question.id}
            onAutoAnswer={handleAnswer}
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

          {hasAnswered && (
            <QuestionFeedback
              isCorrect={selectedAnswer === question.correctAnswer}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correctAnswer}
              explanation={question.explanation}
              onReset={handleReset}
              questionId={question.id}
            />
          )}

          <QuestionFooter 
            questionId={question.id}
            correctAnswer={question.correctAnswer}
          />
        </div>
      </CardContent>
    </Card>
  );
});

QuestionContent.displayName = 'QuestionContent';

export default QuestionContent;