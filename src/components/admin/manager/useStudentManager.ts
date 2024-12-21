import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleSheetsData } from "@/hooks/useGoogleSheetsData";
import { supabase } from "@/integrations/supabase/client";

export const useStudentManager = () => {
  const { toast } = useToast();
  const { data: sheetsData, isLoading, refetch } = useGoogleSheetsData();
  const [showStudents, setShowStudents] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
  });

  const students = sheetsData?.users.filter(user => user.type === 'student') || [];

  const handleToggleStatus = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const newStatus = student.status === "active" ? "blocked" : "active";
      
      console.log('Updating student status:', { studentId, newStatus });
      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', studentId);

      if (error) {
        console.error('Error updating student status:', error);
        throw error;
      }
      
      toast({
        title: "Status atualizado",
        description: "O status do aluno foi atualizado com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do aluno.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStudent = async (studentId: string, data: any) => {
    try {
      console.log('Updating student:', { studentId, data });
      const { error } = await supabase
        .from('students')
        .update(data)
        .eq('id', studentId);

      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }

      toast({
        title: "Aluno atualizado",
        description: "Os dados do aluno foram atualizados com sucesso.",
      });
      
      refetch();
    } catch (error) {
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
      console.log('Adding new student:', newStudent);
      const { error } = await supabase
        .from('students')
        .insert([{
          ...newStudent,
          status: 'active'
        }]);

      if (error) {
        console.error('Error adding student:', error);
        throw error;
      }

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
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro ao adicionar aluno",
        description: "Ocorreu um erro ao cadastrar o novo aluno.",
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