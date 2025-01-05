import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import QuestionMetadata from "./QuestionMetadata";
import QuestionOptions from "@/features/questions/components/question/QuestionOptions";
import NavigationButtons from "./NavigationButtons";
import QuestionFeedback from "./QuestionFeedback";
import { QuestionCommentsDialog } from "./QuestionCommentsDialog";
import PreviousAnswerInfo from "./PreviousAnswerInfo";
import QuestionStats from "./QuestionStats";

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
  sessionStats: {
    totalAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
  };
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
  studentId,
  sessionStats,
  showQuestionId = false,
}: QuestionContentProps) => {
  console.log("Renderizando QuestionContent para questão:", question.id);

  const options = [
    { id: "A", text: question.option_a },
    { id: "B", text: question.option_b },
    { id: "C", text: question.option_c },
    { id: "D", text: question.option_d },
    { id: "E", text: question.option_e },
  ];

  return (
    <Card className="animate-fade-in dark:bg-gray-800">
      <CardContent className="p-4 sm:p-6">
        <QuestionCommentsDialog questionId={question.id} />
        
        <div className="space-y-6">
          <QuestionStats 
            totalQuestions={sessionStats.totalAnswered}
            correctAnswers={sessionStats.correctAnswers}
            incorrectAnswers={sessionStats.incorrectAnswers}
          />

          {studentId && (
            <PreviousAnswerInfo 
              questionId={question.id} 
              studentId={studentId}
            />
          )}

          <QuestionMetadata
            id={question.id}
            subject={question.subject}
            topic={question.topic}
            source={question.source}
            showId={showQuestionId}
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