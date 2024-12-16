import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "./QuestionMetadata";
import EnhancedQuestionOptions from "./EnhancedQuestionOptions";
import NavigationButtons from "./NavigationButtons";
import QuestionFeedback from "./QuestionFeedback";
import ThemeSelector from "@/components/theme/ThemeSelector";
import QuestionCounter from "./QuestionCounter";
import PreviousAnswerInfo from "./PreviousAnswerInfo";
import { QuestionFooter } from "./QuestionFooter";

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
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <QuestionCounter 
              current={questionNumber} 
              total={totalQuestions} 
            />
            <PreviousAnswerInfo 
              questionId={question.id}
              studentId={studentId}
            />
          </div>

          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
          />

          <div className="text-base dark:text-gray-200 text-left">
            {question.text}
          </div>

          <EnhancedQuestionOptions
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