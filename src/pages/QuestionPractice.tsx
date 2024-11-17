import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/student/QuestionCard";
import QuestionFilters from "@/components/student/QuestionFilters";
import { useState } from "react";

const QuestionPractice = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);

  // Sample data - In a real app, this would come from your backend
  const subjects = [
    {
      id: 1,
      name: "História",
      topics: ["Idade Moderna", "Brasil Colônia", "Segunda Guerra Mundial"],
    },
    {
      id: 2,
      name: "Geografia",
      topics: ["Clima", "Relevo", "População"],
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
      { id: "E", text: "A manutenção do sistema feudal." },
    ],
    correctAnswer: "A",
    explanation:
      "A expansão marítima europeia dos séculos XV e XVI contribuiu diretamente para o desmatamento devido à necessidade de madeira para a construção de navios.",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Prática de Questões</h1>
          <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
            Voltar ao Painel
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
          <QuestionCard
            question={sampleQuestion}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            onAnswerSelect={(answer) => {
              setSelectedAnswer(answer);
              setHasAnswered(true);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default QuestionPractice;