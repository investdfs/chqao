import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddStudentFormProps {
  newStudent: {
    name: string;
    email: string;
    password: string;
  };
  onStudentChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const AddStudentForm = ({
  newStudent,
  onStudentChange,
  onSubmit
}: AddStudentFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label>Nome</label>
        <Input 
          placeholder="Nome do aluno"
          value={newStudent.name}
          onChange={(e) => onStudentChange('name', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label>Email</label>
        <Input 
          type="email" 
          placeholder="Email do aluno"
          value={newStudent.email}
          onChange={(e) => onStudentChange('email', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label>Senha</label>
        <Input 
          type="password" 
          placeholder="Senha inicial"
          value={newStudent.password}
          onChange={(e) => onStudentChange('password', e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={onSubmit}>
        Adicionar Aluno
      </Button>
    </div>
  );
};