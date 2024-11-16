import * as XLSX from 'xlsx';

export const downloadExcelTemplate = () => {
  const headers = ["Matéria", "Tópico", "Questão", "Opção A", "Opção B", "Opção C", "Opção D", "Opção E", "Resposta Correta", "Explicação", "Dificuldade"];
  
  const data = [
    ["Matemática", "Álgebra", "Quanto é 2 + 2?", "2", "3", "4", "5", "6", "C", "A soma de 2 + 2 é igual a 4", "Fácil"],
    ["Português", "Gramática", "O que é um substantivo?", "Palavra que indica ação", "Palavra que nomeia seres", "Palavra que qualifica", "Palavra que liga", "Palavra que modifica", "B", "Substantivo é a palavra que nomeia seres, objetos, lugares, sentimentos, etc.", "Médio"]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  // Adjust column widths
  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, "modelo_questoes.xlsx");
};