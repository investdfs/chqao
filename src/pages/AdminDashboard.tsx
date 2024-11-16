import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Here you would handle the file upload
    console.log("File uploaded:", event.target.files?.[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary">CHQAO - Painel Administrativo</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Sair
          </Button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,234</div>
              <p className="text-gray-600">Alunos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">5,678</div>
              <p className="text-gray-600">Questões no banco</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Média de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">78%</div>
              <p className="text-gray-600">Taxa média de acerto</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Importar Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Clique para fazer upload ou arraste um arquivo
                  </span>
                  <span className="text-xs text-gray-400">
                    Suporta arquivos CSV e Excel
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;