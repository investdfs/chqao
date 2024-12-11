import { useEffect } from "react";

interface QuestionsListProps {
  questions: any[];
  onQuestionSelect: (question: any) => void;
}

export const QuestionsList = ({ questions, onQuestionSelect }: QuestionsListProps) => {
  useEffect(() => {
    console.log("Questions loaded:", questions.length);
  }, [questions]);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {questions.map((question) => (
        <div 
          key={question.id} 
          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => onQuestionSelect(question)}
        >
          <p className="font-medium">{question.text}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span>{question.subject}</span>
            {question.topic && <span> • {question.topic}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};