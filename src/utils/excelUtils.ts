import * as XLSX from 'xlsx';
import { columnWidths, headers } from './excel/columnConfig';
import { templateSubjects, getTemplateData } from './excel/templateData';
import { processExcelFile } from './excel/processExcel';

export const downloadExcelTemplate = () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const templateData = getTemplateData();
    const wb = XLSX.utils.book_new();

    // Criar uma aba para cada matéria
    Object.entries(templateData).forEach(([subject, examples]) => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);
      ws['!cols'] = columnWidths;

      // Estilização do cabeçalho
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Q2');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1A4D2E" } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }

      XLSX.utils.book_append_sheet(wb, ws, subject);
    });

    // Adicionar aba de instruções
    const instructions = [
      ["Instruções para Preenchimento"],
      [""],
      ["1. Cada aba representa uma matéria diferente"],
      ["2. Organize as questões por Tema e Assunto dentro de cada matéria"],
      ["3. Mantenha o formato exato das colunas ao adicionar suas questões"],
      ["4. A coluna 'Resposta Correta' deve conter apenas A, B, C, D ou E"],
      ["5. A coluna 'Dificuldade' deve ser preenchida com: Fácil, Médio ou Difícil"],
      ["6. O campo 'URL da Imagem' é opcional - deixe em branco se não houver imagem"],
      ["7. Para questões de concursos anteriores, marque 'Sim' e preencha o ano e nome"],
      ["8. Você pode adicionar quantas linhas quiser em cada aba"],
      ["9. Não modifique o cabeçalho das colunas"]
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions['!cols'] = [{ wch: 80 }];
    wsInstructions['A1'].s = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1A4D2E" } },
      alignment: { horizontal: 'center' }
    };

    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instruções");

    XLSX.writeFile(wb, "modelo_questoes.xlsx");
    console.log('Download do template concluído com sucesso');
  } catch (error) {
    console.error('Erro ao gerar template Excel:', error);
    throw error;
  }
};

export { processExcelFile };