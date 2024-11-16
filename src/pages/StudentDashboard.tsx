import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/student/QuestionCard";
import QuestionFilters from "@/components/student/QuestionFilters";
import { PerformanceMetrics } from "@/components/student/PerformanceMetrics";
import { SubjectProgress } from "@/components/student/SubjectProgress";
import { StudyGuide } from "@/components/student/StudyGuide";

const subjects = [
  { 
    id: 1, 
    name: "História", 
    topics: ["Idade Moderna", "Brasil Colônia", "Segunda Guerra Mundial"] 
  },
  { 
    id: 2, 
    name: "Geografia", 
    topics: ["Clima", "Relevo", "População"] 
  },
  { 
    id: 3, 
    name: "Biologia", 
    topics: ["Genética", "Ecologia", "Evolução"] 
  },
];

const sampleQuestion = {
  id: 1,
  text: "Os séculos XV e XVI, quando se vão desmoronando as estruturas socioeconômicas da Idade Média perante os novos imperativos da Época moderna, constituem um momento-chave na história florestal de toda a Europa Ocidental. Qual acontecimento do período contribuiu diretamente para o agravamento da situação descrita?",
  options: [
    { id: "A", text: "O processo de expansão marítima." },
    { id: "B", text: "A eclosão do renascimento cultural." },
    { id: "C", text: "A concretização da centralização política." },
    { id: "D", text: "O movimento de reformas religiosas." },
    { id: "E", text: "A manutenção do sistema feudal." }
  ],
  correctAnswer: "A",
  explanation: "A expansão marítima europeia dos séculos XV e XVI contribuiu diretamente para o agravamento do desmatamento devido à necessidade de madeira para a construção de navios e desenvolvimento da indústria naval, além do aumento do comércio que intensificou a exploração de recursos florestais."
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Sample data - In a real app, this would come from an API/database
  const performanceData = {
    correctAnswers: 3,
    totalQuestions: 4,
    studyTime: "5m 12s",
    averageTime: "1m 18s",
  };

  const subjectsProgress = [
    { name: "Biologia", questionsAnswered: 3, correctAnswers: 2 },
    { name: "Português", questionsAnswered: 1, correctAnswers: 1 },
  ];

  const studyGuideData = {
    weakPoints: ["Genética", "Ecologia"],
    strongPoints: ["Evolução", "População"],
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setHasAnswered(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`bg-white shadow-sm transition-opacity duration-300 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">CHQAO - Estude Praticando</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className={`space-y-6 ${isFocusMode ? 'hidden' : ''}`}>
          <PerformanceMetrics {...performanceData} />
          <SubjectProgress subjects={subjectsProgress} />
          <StudyGuide {...studyGuideData} />
        </div>

        <QuestionFilters
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          onSubjectChange={setSelectedSubject}
          onTopicChange={setSelectedTopic}
          subjects={subjects}
          onFocusMode={() => setIsFocusMode(!isFocusMode)}
          isFocusMode={isFocusMode}
        />

        {selectedSubject && selectedTopic && (
          <div className="mt-6">
            <QuestionCard
              question={sampleQuestion}
              selectedAnswer={selectedAnswer}
              hasAnswered={hasAnswered}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
