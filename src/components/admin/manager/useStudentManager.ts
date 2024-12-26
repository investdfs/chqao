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
      // Validar campos obrigatórios
      if (!newStudent.email || !newStudent.name || !newStudent.password) {
        toast({
          title: "Erro ao adicionar aluno",
          description: "Todos os campos são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      console.log('Iniciando cadastro de novo aluno:', { 
        email: newStudent.email, 
        name: newStudent.name 
      });

      // Primeiro criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: newStudent.password,
        options: {
          data: {
            name: newStudent.name,
            type: 'student'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário na autenticação:', authError);
        throw authError;
      }

      console.log('Usuário criado na autenticação:', authData);

      // Depois inserir na tabela students
      const { error: studentError } = await supabase
        .from('students')
        .insert([{
          email: newStudent.email,
          name: newStudent.name,
          password: newStudent.password,
          status: 'active',
        }]);

      if (studentError) {
        console.error('Erro ao inserir estudante:', studentError);
        throw studentError;
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