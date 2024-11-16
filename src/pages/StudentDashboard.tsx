import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Check, X, RotateCcw } from "lucide-react";

const subjects = [
  { id: 1, name: "História", topics: ["Idade Moderna", "Brasil Colônia", "Segunda Guerra Mundial"] },
  { id: 2, name: "Geografia", topics: ["Clima", "Relevo", "População"] },
  { id: 3, name: "Biologia", topics: ["Genética", "Ecologia", "Evolução"] },
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
  correctAnswer: "A"
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(2);
  const totalQuestions = 10;

  const handleAnswer = () => {
    setHasAnswered(true);
    if (selectedAnswer === sampleQuestion.correctAnswer) {
      setQuestionsAnswered((prev) => Math.min(prev + 1, totalQuestions));
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer("");
    setHasAnswered(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary">CHQAO - Estude Praticando</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={(questionsAnswered / totalQuestions) * 100} />
                <p className="text-sm text-gray-600">
                  {questionsAnswered}/{totalQuestions} questões respondidas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selecione a Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selecione o Tópico</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTopic}
                onValueChange={setSelectedTopic}
                disabled={!selectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um tópico" />
                </SelectTrigger>
                <SelectContent>
                  {subjects
                    .find((s) => s.name === selectedSubject)
                    ?.topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {selectedSubject && selectedTopic && (
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-lg font-medium">{sampleQuestion.text}</div>
                
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  disabled={hasAnswered}
                  className="space-y-3"
                >
                  {sampleQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-2 p-4 rounded-lg border ${
                        hasAnswered
                          ? option.id === sampleQuestion.correctAnswer
                            ? "border-success bg-success-light"
                            : option.id === selectedAnswer
                            ? "border-error bg-error-light"
                            : "border-gray-200"
                          : "border-gray-200 hover:border-primary hover:bg-primary-light"
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        {option.text}
                      </label>
                      {hasAnswered && option.id === sampleQuestion.correctAnswer && (
                        <Check className="h-5 w-5 text-success" />
                      )}
                      {hasAnswered &&
                        option.id === selectedAnswer &&
                        option.id !== sampleQuestion.correctAnswer && (
                          <X className="h-5 w-5 text-error" />
                        )}
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between items-center">
                  {hasAnswered ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={resetQuestion}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Refazer
                      </Button>
                      <div className="flex items-center gap-4">
                        <Button variant="outline">Anterior</Button>
                        <Button>Próxima</Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={handleAnswer}
                      disabled={!selectedAnswer}
                      className="ml-auto"
                    >
                      Responder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;