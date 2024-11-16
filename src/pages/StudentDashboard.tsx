import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary">CHQAO - Dashboard do Aluno</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">75%</div>
              <p className="text-gray-600">Questões respondidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">85%</div>
              <p className="text-gray-600">Taxa de acerto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próxima Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">100</div>
              <p className="text-gray-600">Questões para revisar</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questões Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((question) => (
                <div
                  key={question}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-medium">Questão {question}</h3>
                  <p className="text-gray-600">
                    Última tentativa: há {question} dias
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;