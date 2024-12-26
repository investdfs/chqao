import { toast } from "@/components/ui/use-toast";

export interface StudentFormData {
  name: string;
  email: string;
  password: string;
}

export const validateStudentData = (data: StudentFormData): boolean => {
  if (!data.email || !data.name || !data.password) {
    toast({
      title: "Erro ao adicionar aluno",
      description: "Todos os campos são obrigatórios.",
      variant: "destructive"
    });
    return false;
  }

  if (data.password.length < 6) {
    toast({
      title: "Erro ao adicionar aluno",
      description: "A senha deve ter no mínimo 6 caracteres.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};