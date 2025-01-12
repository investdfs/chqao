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

## 2. Funcionalidades do Sistema

### 2.1 Para Administradores
[... keep existing code for admin functionalities]

## 3. Instruções para Geração via IA

### 3.1 Formato do Prompt
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

4. Saída em formato Excel:
   - Uma questão por linha
   - Colunas na ordem: Tema, Assunto, Questão, URL da Imagem (deixar vazio), Opção A, B, C, D, E, Resposta Correta, Explicação, Dificuldade
```

### 3.2 Matérias Suportadas
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

### 3.3 Validação do Conteúdo
Antes de importar, verifique se:
1. Todas as questões têm exatamente 5 alternativas
2. A resposta correta é uma letra entre A e E
3. Os nomes das matérias estão exatamente como listado
4. A dificuldade está como "Fácil", "Médio" ou "Difícil"
5. Não há células vazias nas colunas obrigatórias

### 3.4 Exemplo de Questão Válida
```
Tema: Hierarquia Militar
Assunto: Círculos Hierárquicos
Questão: De acordo com o Estatuto dos Militares, os círculos hierárquicos são âmbitos de convivência entre os militares da mesma categoria e têm a finalidade de desenvolver o espírito de camaradagem, em ambiente de estima e confiança, sem prejuízo do respeito mútuo. Sobre os círculos hierárquicos, é correto afirmar que:
Opção A: Os Guardas-Marinha e Aspirantes-a-Oficial são hierarquicamente superiores às demais praças
Opção B: Os Suboficiais e Sargentos pertencem ao mesmo círculo hierárquico dos Oficiais Subalternos
Opção C: Os Cabos e Soldados não constituem um círculo hierárquico próprio
Opção D: Os Oficiais Generais pertencem ao mesmo círculo hierárquico dos Oficiais Superiores
Opção E: Os Oficiais Intermediários e Subalternos pertencem a círculos hierárquicos distintos
Resposta: A
Explicação: Conforme o Estatuto dos Militares, os Guardas-Marinha e Aspirantes-a-Oficial são, de fato, hierarquicamente superiores às demais praças, constituindo uma categoria especial dentro da hierarquia militar.
Dificuldade: Médio
```

### 3.5 Erros Comuns a Evitar
1. Uso de formatação HTML ou markdown
2. Múltiplas respostas corretas
3. Menos de 5 alternativas
4. Resposta correta fora do padrão A-E
5. Matérias não listadas no sistema
6. Dificuldade fora do padrão estabelecido

### 3.6 Processo de Importação
1. Gere as questões via IA seguindo o formato
2. Salve em Excel usando o template do sistema
3. Verifique a formatação e padronização
4. Importe através do painel administrativo
5. Confirme o sucesso da importação
6. Verifique as questões importadas