import QuestionCard from "@/components/student/QuestionCard";
import QuestionFilters from "@/components/student/QuestionFilters";
import { useState } from "react";

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

const QuestionPractice = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <QuestionCard
            question={sampleQuestion}
            selectedAnswer={selectedAnswer}
            hasAnswered={hasAnswered}
            onAnswerSelect={(value) => {
              setSelectedAnswer(value);
              setHasAnswered(true);
            }}
            isUserBlocked={false}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionPractice;