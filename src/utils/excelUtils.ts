export const downloadExcelTemplate = () => {
  // In a real application, this would generate an actual Excel file
  // For now, we'll create a simple CSV that Excel can open
  const headers = ["Matéria", "Tópico", "Questão", "Resposta Correta", "Dificuldade"];
  const data = [
    ["Matemática", "Álgebra", "Quanto é 2 + 2?", "4", "Fácil"],
    ["Português", "Gramática", "O que é um substantivo?", "Palavra que nomeia seres", "Médio"]
  ];

  const csvContent = [
    headers.join(","),
    ...data.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "modelo_questoes.xls");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};