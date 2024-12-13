import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "@/features/questions/components/QuestionCard";
import { QuestionProvider } from "@/features/questions/contexts/QuestionContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const isPreviewMode = window.location.hostname === 'preview.lovable.dev';

// Mock student data for preview mode
const previewStudentData = {
  id: 'preview-user',
  email: 'preview@example.com',
  name: 'Preview User',
  status: 'active'
};

const PreviousExamsContent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['previous-exam-questions'],
    queryFn: async () => {
      console.log('Fetching previous exam questions...');
      const { data, error } = await supabase
        .from('previous_exam_questions')
        .select(`
          *,
          previous_exams (
            year,
            name
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching previous exam questions:', error);
        throw error;
      }

      // Transform the data to match the expected question format
      const formattedQuestions = data.map(q => ({
        id: q.id,
        text: q.text,
        subject: q.subject,
        topic: q.topic,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        option_e: q.option_e,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        exam_year: q.previous_exams?.year,
        exam_name: q.previous_exams?.name
      }));

      console.log(`Fetched ${formattedQuestions.length} previous exam questions`);
      return formattedQuestions;
    }
  });

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-[600px] w-full rounded-lg bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-100">
            Nenhuma questão de prova anterior disponível
          </h2>
          <p className="mt-2 text-gray-400">
            Aguarde até que novas questões sejam adicionadas
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          question={currentQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          studentId={isPreviewMode ? previewStudentData.id : undefined}
          isUserBlocked={false}
        />
      </div>
    </div>
  );
};

const PreviousExams = () => {
  return (
    <QuestionProvider>
      <PreviousExamsContent />
    </QuestionProvider>
  );
};

export default PreviousExams;