import * as XLSX from 'xlsx';
import { templateSubjects, getTemplateData } from './excel/templateData';

export const downloadExcelTemplate = async () => {
  console.log('Iniciando download do template Excel');
  
  try {
    const wb = XLSX.utils.book_new();
    const templateData = getTemplateData();

    // Criar uma aba para cada matéria
    templateSubjects.forEach(subject => {
      console.log(`Criando aba para: ${subject}`);
      
      const headers = [
        "Tema",
        "Assunto",
        "Questão",
        "URL da Imagem",
        "Opção A",
        "Opção B",
        "Opção C",
        "Opção D",
        "Opção E",
        "Resposta Correta",
        "Explicação",
        "Dificuldade",
        "Questão de Concurso Anterior?",
        "Ano do Concurso",
        "Nome do Concurso"
      ];

      // Criar exemplo de linha para cada matéria
      const exampleRow = [
        "Exemplo Tema",
        "Exemplo Assunto",
        "Texto da questão exemplo",
        "",
        "Alternativa A",
        "Alternativa B",
        "Alternativa C",
        "Alternativa D",
        "Alternativa E",
        "A",
        "Explicação da resposta",
        "Médio",
        "Não",
        "",
        ""
      ];

      const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

      // Configurar largura das colunas
      const colWidths = [
        { wch: 25 },  // Tema
        { wch: 25 },  // Assunto
        { wch: 50 },  // Questão
        { wch: 30 },  // URL da Imagem
        { wch: 20 },  // Opção A
        { wch: 20 },  // Opção B
        { wch: 20 },  // Opção C
        { wch: 20 },  // Opção D
        { wch: 20 },  // Opção E
        { wch: 15 },  // Resposta Correta
        { wch: 50 },  // Explicação
        { wch: 15 },  // Dificuldade
        { wch: 15 },  // Questão de Concurso
        { wch: 15 },  // Ano
        { wch: 25 }   // Nome do Concurso
      ];

      ws['!cols'] = colWidths;

      // Estilizar cabeçalho
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1A4D2E" } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };

      // Aplicar estilo ao cabeçalho
      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = headerStyle;
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

    // Fazer o download
    XLSX.writeFile(wb, "modelo_questoes.xlsx");
    console.log('Download do template concluído com sucesso');
  } catch (error) {
    console.error('Erro ao gerar template Excel:', error);
    throw error;
  }
};