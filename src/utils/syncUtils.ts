import { insertSheetData } from "@/integrations/sheetdb/client";

export const syncNewData = async () => {
  console.log('Iniciando sincronização de novos dados...');
  
  // Aqui podemos adicionar mais lógica de sincronização no futuro
  // Por exemplo, sincronizar outras matérias ou questões
  const newSubjects = [
    {
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
    }
    // Outros dados podem ser adicionados aqui
  ];

  console.log('Inserindo novos dados:', newSubjects);
  
  // Insere cada novo item
  for (const item of newSubjects) {
    await insertSheetData(item);
  }
  
  console.log('Sincronização concluída com sucesso');
};