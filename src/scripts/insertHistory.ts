import { insertSheetData } from '../integrations/sheetdb/client';

const insertHistory = async () => {
  try {
    await insertSheetData({
      id: "3",
      subject: "História",
      topic: "",
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",
      correctAnswer: "",
      explanation: ""
    });
    console.log('Matéria História inserida com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir matéria História:', error);
  }
};

insertHistory();