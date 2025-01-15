import { supabase } from "@/integrations/supabase/client";
import { StudentFormData } from "../validation/studentValidation";
import { StudentInsert, StudentUpdate, StudentStatus } from "@/types/database/supabase";

export const createStudent = async (data: StudentFormData) => {
  console.log('Iniciando cadastro de novo aluno:', { 
    email: data.email, 
    name: data.name 
  });

  // Primeiro, criar o usuário na autenticação
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        type: 'student'
      }
    }
  });

  if (authError) {
    console.error('Erro ao criar usuário na autenticação:', authError);
    throw authError;
  }

  console.log('Usuário criado na autenticação:', authData);

  // Depois, inserir na tabela students
  const studentData: StudentInsert = {
    email: data.email,
    name: data.name,
    password: data.password,
    status: 'active',
  };

  const { error: studentError } = await supabase
    .from('students')
    .insert([studentData]);

  if (studentError) {
    console.error('Erro ao inserir estudante:', studentError);
    throw studentError;
  }

  return authData;
};

export const toggleStudentStatus = async (studentId: string, currentStatus: string) => {
  const newStatus = currentStatus === "active" ? "blocked" : "active";
  
  const updateData: StudentUpdate = { 
    status: newStatus as StudentStatus 
  };

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', studentId);

  if (error) {
    console.error('Error updating student status:', error);
    throw error;
  }

  return newStatus;
};

export const updateStudentData = async (studentId: string, data: Partial<StudentFormData>) => {
  const updateData: StudentUpdate = {
    ...data
  };

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', studentId);

  if (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};