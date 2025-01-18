# Sistema de Questões CHQAO

## 1. Estrutura das Questões

### 1.1 Composição
Cada questão contém:
- **Texto**: Enunciado completo
- **Alternativas**: 5 opções (A a E)
- **Gabarito**: Resposta correta
- **Explicação**: Detalhamento da resolução
- **Metadados**: Matéria, tema, dificuldade
- **Fonte**: Origem da questão (quando aplicável)

### 1.2 Categorização
Organização hierárquica:
- **Temas**: Grandes áreas do conhecimento
- **Matérias**: Subdivisões dos temas
- **Tópicos**: Pontos específicos
- **Dificuldade**: Fácil, Médio, Difícil

## 2. Especificações do CSV

### 2.1 Formato do Arquivo
- **Extensão**: .csv
- **Codificação**: UTF-8
- **Delimitador**: vírgula (,)
- **Qualificador de texto**: aspas duplas (")
- **Tamanho máximo**: 10MB

### 2.2 Colunas Obrigatórias
1. **Tema** (coluna A)
   - Texto sem formatação
   - Máximo 100 caracteres
   - Exemplo: "Hierarquia Militar"

2. **Assunto** (coluna B)
   - Texto sem formatação
   - Máximo 100 caracteres
   - Exemplo: "Círculos Hierárquicos"

3. **Questão** (coluna C)
   - Texto sem formatação
   - Sem quebras de linha
   - Sem caracteres especiais
   - Máximo 2000 caracteres

4. **URL da Imagem** (coluna D)
   - Opcional
   - Link direto para imagem
   - Deixar vazio se não houver

5. **Opção A** (coluna E)
   - Texto sem formatação
   - Máximo 500 caracteres

6. **Opção B** (coluna F)
   - Texto sem formatação
   - Máximo 500 caracteres

7. **Opção C** (coluna G)
   - Texto sem formatação
   - Máximo 500 caracteres

8. **Opção D** (coluna H)
   - Texto sem formatação
   - Máximo 500 caracteres

9. **Opção E** (coluna I)
   - Texto sem formatação
   - Máximo 500 caracteres

10. **Resposta Correta** (coluna J)
    - Apenas letras: A, B, C, D ou E
    - Maiúscula obrigatória

11. **Explicação** (coluna K)
    - Texto sem formatação
    - Máximo 1000 caracteres

12. **Dificuldade** (coluna L)
    - Valores aceitos: "Fácil", "Médio" ou "Difícil"
    - Com acentuação

### 2.3 Colunas Opcionais
13. **Questão de Concurso** (coluna M)
    - Valores aceitos: "Sim" ou "Não"
    - Padrão: "Não"

14. **Ano** (coluna N)
    - Número inteiro de 4 dígitos
    - Exemplo: 2023

15. **Nome do Concurso** (coluna O)
    - Texto livre
    - Máximo 200 caracteres

## 3. Matérias Suportadas
Use exatamente estes nomes de matérias:
- Língua Portuguesa
- Geografia do Brasil
- História do Brasil
- Estatuto dos Militares
- Licitações e Contratos
- Regulamento de Administração do Exército (RAE)
- Direito Militar e Sindicância
- Código Penal Militar
- Código de Processo Penal Militar

## 4. Instruções para Geração via IA

### 4.1 Formato do Prompt
Para gerar questões compatíveis com o sistema, use o seguinte formato de prompt:

```
Gere questões de múltipla escolha seguindo estritamente estas regras:

1. Formato:
   - Matéria: [especificar matéria exata do sistema]
   - Tema: [especificar tema existente]
   - Tópico: [especificar tópico]
   - Dificuldade: usar apenas "Fácil", "Médio" ou "Difícil"

2. Estrutura da Questão:
   - Enunciado: 2-4 parágrafos, linguagem clara
   - 5 alternativas (A a E)
   - Apenas UMA alternativa correta
   - Explicação detalhada da resposta

3. Regras Específicas:
   - Sem uso de imagens
   - Sem formatação especial (negrito, itálico)
   - Sem caracteres especiais
   - Sem quebras de linha no meio do texto
   - Sem tabelas ou fórmulas complexas

4. Saída em formato CSV:
   - Uma questão por linha
   - Colunas na ordem especificada
   - Valores entre aspas duplas
   - Campos separados por vírgula
```

### 4.2 Exemplo de Questão em CSV
```csv
"Hierarquia Militar","Círculos Hierárquicos","De acordo com o Estatuto dos Militares, os círculos hierárquicos são âmbitos de convivência entre os militares da mesma categoria e têm a finalidade de desenvolver o espírito de camaradagem, em ambiente de estima e confiança, sem prejuízo do respeito mútuo. Sobre os círculos hierárquicos, é correto afirmar que:","","Os Guardas-Marinha e Aspirantes-a-Oficial são hierarquicamente superiores às demais praças","Os Suboficiais e Sargentos pertencem ao mesmo círculo hierárquico dos Oficiais Subalternos","Os Cabos e Soldados não constituem um círculo hierárquico próprio","Os Oficiais Generais pertencem ao mesmo círculo hierárquico dos Oficiais Superiores","Os Oficiais Intermediários e Subalternos pertencem a círculos hierárquicos distintos","A","Conforme o Estatuto dos Militares, os Guardas-Marinha e Aspirantes-a-Oficial são, de fato, hierarquicamente superiores às demais praças, constituindo uma categoria especial dentro da hierarquia militar.","Médio","Não","",""
```

### 4.3 Validação do CSV
Antes de importar, verifique se:
1. O arquivo está codificado em UTF-8
2. Todas as colunas obrigatórias estão presentes
3. Os valores estão entre aspas duplas
4. Os campos estão separados por vírgula
5. Não há quebras de linha dentro dos campos
6. Os nomes das matérias estão exatamente como listado
7. A dificuldade está como "Fácil", "Médio" ou "Difícil"
8. Não há células vazias nas colunas obrigatórias
9. Os textos não contêm formatação HTML ou markdown
10. Os limites de caracteres são respeitados

### 4.4 Erros Comuns a Evitar
1. Uso de formatação HTML ou markdown
2. Múltiplas respostas corretas
3. Menos de 5 alternativas
4. Resposta correta fora do padrão A-E
5. Matérias não listadas no sistema
6. Dificuldade fora do padrão estabelecido
7. Células vazias em colunas obrigatórias
8. Caracteres especiais no texto
9. Quebras de linha no meio do texto
10. Ultrapassar limites de caracteres

### 4.5 Processo de Importação
1. Gere as questões via IA seguindo o formato
2. Salve em CSV usando a codificação UTF-8
3. Verifique a formatação e padronização
4. Importe através do painel administrativo
5. Confirme o sucesso da importação
6. Verifique as questões importadas

### 4.6 Dicas de Importação
1. Faça importações em lotes menores (máximo 100 questões)
2. Verifique a codificação do arquivo
3. Mantenha backup do arquivo original
4. Teste algumas questões antes de importar todo o lote
5. Use o validador de CSV antes da importação