import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "./QuestionMetadata";
import QuestionOptions from "./QuestionOptions";
import NavigationButtons from "./NavigationButtons";
import QuestionFeedback from "./QuestionFeedback";

interface QuestionContentProps {
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
    subject?: string;
    topic?: string;
    source?: string;
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
  console.log("Renderizando QuestionContent para questão:", question.id);

  const options = [
    { id: 'A', text: question.option_a },
    { id: 'B', text: question.option_b },
    { id: 'C', text: question.option_c },
    { id: 'D', text: question.option_d },
    { id: 'E', text: question.option_e },
  ];

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
          </div>

          <QuestionOptions
            options={options}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            correctAnswer={question.correct_answer}
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
              isCorrect={selectedAnswer === question.correct_answer}
              selectedAnswer={selectedAnswer}
              correctAnswer={question.correct_answer}
              explanation={question.explanation}
              onReset={handleReset}
              questionId={question.id}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

QuestionContent.displayName = 'QuestionContent';

export default QuestionContent;