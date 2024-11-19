import { useState } from "react";
import { ThemeProvider } from "next-themes";
import QuestionCard from "@/components/student/QuestionCard";
import QuestionFilters from "@/components/student/QuestionFilters";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";

const QuestionPractice = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [skipCompleted, setSkipCompleted] = useState(false);
  const [prioritizeErrors, setPrioritizeErrors] = useState(false);

  const { data: sheetsData, isLoading } = useGoogleSheetsData();

  // Transform sheet questions to the format expected by QuestionCard
  const questions = sheetsData?.questions.map(q => ({
    id: parseInt(q.id),
    text: q.text,
    subject: q.subject,
    topic: q.topic,
    options: [
      { id: "A", text: q.optionA },
      { id: "B", text: q.optionB },
      { id: "C", text: q.optionC },
      { id: "D", text: q.optionD },
      { id: "E", text: q.optionE },
    ],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  })) || [];

  // Get unique subjects and their topics, converting subject IDs to numbers
  const subjects = Array.from(new Set(questions.map(q => q.subject)))
    .map(subject => ({
      id: subject.toLowerCase().replace(/\s+/g, '-'), // Create a URL-friendly string ID
      name: subject,
      topics: Array.from(new Set(questions
        .filter(q => q.subject === subject)
        .map(q => q.topic)))
    }));

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return <div>Carregando questões...</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <QuestionFilters
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          onSubjectChange={setSelectedSubject}
          onTopicChange={setSelectedTopic}
          subjects={subjects}
          onFocusMode={() => setIsFocusMode(!isFocusMode)}
          isFocusMode={isFocusMode}
          questionCount={questionCount}
          onQuestionCountChange={(value) => setQuestionCount(Number(value))}
          skipCompleted={skipCompleted}
          onSkipCompletedChange={setSkipCompleted}
          prioritizeErrors={prioritizeErrors}
          onPrioritizeErrorsChange={setPrioritizeErrors}
        />

        <div className="max-w-3xl mx-auto px-4 py-6">
          {questions.length > 0 ? (
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onNextQuestion={handleNextQuestion}
              onPreviousQuestion={handlePreviousQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              isUserBlocked={false}
            />
          ) : (
            <div className="text-center py-8">
              <p>Nenhuma questão encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default QuestionPractice;