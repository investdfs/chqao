import { supabase } from "@/integrations/supabase/client";
import { StudentFormData } from "../validation/studentValidation";

export const createStudent = async (data: StudentFormData) => {
  console.log('Iniciando cadastro de novo aluno:', { 
    email: data.email, 
    name: data.name 
  });

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

  const { error: studentError } = await supabase
    .from('students')
    .insert([{
      email: data.email,
      name: data.name,
      password: data.password,
      status: 'active',
    }]);

  if (studentError) {
    console.error('Erro ao inserir estudante:', studentError);
    throw studentError;
  }

  return authData;
};

export const toggleStudentStatus = async (studentId: string, currentStatus: string) => {
  const newStatus = currentStatus === "active" ? "blocked" : "active";
  
  const { error } = await supabase
    .from('students')
    .update({ status: newStatus })
    .eq('id', studentId);

  if (error) {
    console.error('Error updating student status:', error);
    throw error;
  }

  return newStatus;
};

export const updateStudentData = async (studentId: string, data: Partial<StudentFormData>) => {
  const { error } = await supabase
    .from('students')
    .update(data)
    .eq('id', studentId);

  if (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};