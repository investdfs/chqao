import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: number;
  name: string;
  email: string;
  password: string;
  status: string;
  plan: string;
}

interface StudentListProps {
  students: Student[];
  onToggleStatus: (id: number) => void;
}

export const StudentList = ({ students, onToggleStatus }: StudentListProps) => {
  const { toast } = useToast();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Senha</TableHead>
          <TableHead>Plano</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.password}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.plan === "paid" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {student.plan === "paid" ? "Pago" : "Free"}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {student.status === "active" ? "Ativo" : "Bloqueado"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(student.id)}
                >
                  {student.status === "active" ? "Bloquear" : "Ativar"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Dados do Aluno</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label>Nome</label>
                        <Input defaultValue={student.name} />
                      </div>
                      <div className="space-y-2">
                        <label>Email</label>
                        <Input defaultValue={student.email} />
                      </div>
                      <div className="space-y-2">
                        <label>Nova Senha</label>
                        <Input type="password" placeholder="Digite a nova senha" />
                      </div>
                      <div className="space-y-2">
                        <label>Plano</label>
                        <Select defaultValue={student.plan}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="paid">Pago</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={() => {
                        toast({
                          title: "Dados atualizados",
                          description: "Os dados do aluno foram atualizados com sucesso.",
                        });
                      }}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};