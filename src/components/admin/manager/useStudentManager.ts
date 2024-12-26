import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { validateStudentData, StudentFormData } from "./validation/studentValidation";
import { createStudent, toggleStudentStatus, updateStudentData } from "./api/studentApi";

export const useStudentManager = () => {
  const { toast } = useToast();
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [showStudents, setShowStudents] = useState(false);
  const [newStudent, setNewStudent] = useState<StudentFormData>({
    name: '',
    email: '',
    password: '',
  });

  const students = sheetsData?.users.filter(user => user.type === 'student') || [];

  const handleToggleStatus = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      await toggleStudentStatus(studentId, student.status);
      
      toast({
        title: "Status atualizado",
        description: "O status do aluno foi atualizado com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating student status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do aluno.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStudent = async (studentId: string, data: Partial<StudentFormData>) => {
    try {
      await updateStudentData(studentId, data);

      toast({
        title: "Aluno atualizado",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro ao atualizar aluno",
        description: "Ocorreu um erro ao atualizar os dados do aluno.",
        variant: "destructive"
      });
    }
  };

  const handleAddStudent = async () => {
    try {
      if (!validateStudentData(newStudent)) {
        return;
      }

      await createStudent(newStudent);

      toast({
        title: "Aluno adicionado",
        description: "O novo aluno foi cadastrado com sucesso.",
      });
      
      refetch();
      setNewStudent({
        name: '',
        email: '',
        password: '',
      });
    } catch (error: any) {
      console.error('Erro ao adicionar aluno:', error);
      toast({
        title: "Erro ao adicionar aluno",
        description: error.message || "Ocorreu um erro ao cadastrar o novo aluno.",
        variant: "destructive"
      });
    }
  };

  return {
    showStudents,
    setShowStudents,
    newStudent,
    setNewStudent,
    students,
    isLoading,
    handleToggleStatus,
    handleUpdateStudent,
    handleAddStudent
  };
};