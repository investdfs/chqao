import React from "react";
import QuestionMetadata from "./QuestionMetadata";
import QuestionOptions from "./QuestionOptions";
import QuestionFeedback from "./QuestionFeedback";
import NavigationButtons from "./NavigationButtons";

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
    source?: string;
    subject?: string;
    topic?: string;
    exam_year?: number;
    is_from_previous_exam?: boolean;
    exam_question_number?: number;
  };
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  onOptionSelect: (option: string) => void;
  showExplanation: boolean;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionContent = ({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onOptionSelect,
  showExplanation,
  onNextQuestion,
  onPreviousQuestion,
  questionNumber,
  totalQuestions,
}: QuestionContentProps) => {
  console.log("Renderizando QuestionContent:", { question, selectedAnswer, isAnswered });

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <QuestionMetadata
          id={question.id}
          subject={question.subject}
          topic={question.topic}
          source={question.source}
          examYear={question.exam_year}
          isFromPreviousExam={question.is_from_previous_exam}
          examQuestionNumber={question.exam_question_number}
        />
        
        <div className="space-y-4">
          <p className="text-base/relaxed">{question.text}</p>
          
          <QuestionOptions
            options={[
              { id: 'A', text: question.option_a },
              { id: 'B', text: question.option_b },
              { id: 'C', text: question.option_c },
              { id: 'D', text: question.option_d },
              { id: 'E', text: question.option_e },
            ]}
            selectedOption={selectedAnswer}
            onOptionSelect={onOptionSelect}
            isAnswered={isAnswered}
            correctAnswer={question.correct_answer}
          />

          {showExplanation && (
            <QuestionFeedback
              isCorrect={isCorrect}
              explanation={question.explanation}
            />
          )}
        </div>
      </div>

      <NavigationButtons
        onPrevious={onPreviousQuestion}
        onNext={onNextQuestion}
        currentQuestion={questionNumber}
        totalQuestions={totalQuestions}
      />
    </div>
  );
};

export default QuestionContent;