# Configuração do Sistema CHQAO

## 1. Estrutura do Banco de Dados

### 1.1 Tabelas Principais

#### Questions (Questões)
- **Campos Obrigatórios**:
  - subject: Matéria da questão
  - text: Enunciado
  - option_a/b/c/d/e: Alternativas
  - correct_answer: Resposta correta (A-E)
  - explanation: Explicação da resposta

- **Campos Opcionais**:
  - theme: Tema dentro da matéria
  - topic: Tópico específico
  - difficulty: Fácil/Médio/Difícil
  - image_url: URL da imagem (se houver)
  - is_from_previous_exam: Questão de concurso anterior
  - exam_year: Ano do concurso
  - exam_name: Nome do concurso

#### Students (Estudantes)
- id: Identificador único
- email: Email do estudante
- name: Nome completo
- status: active/blocked
- whatsapp: Número WhatsApp
- login_count: Contagem de logins
- completed_cycles: Ciclos de estudo completados

#### Question_Answers (Respostas)
- question_id: ID da questão
- student_id: ID do estudante
- selected_option: Opção selecionada
- created_at: Data/hora da resposta

#### Study_Sessions (Sessões de Estudo)
- student_id: ID do estudante
- correct_answers: Total de acertos
- incorrect_answers: Total de erros
- percentage: Percentual de acerto
- created_at: Data/hora da sessão

### 1.2 Estrutura Hierárquica

#### Subject_Structure
- subject: Matéria principal
- theme: Tema da matéria
- topic: Tópico específico
- level: Nível na hierarquia
- parent_id: ID do nível superior
- display_order: Ordem de exibição

## 2. Formato JSON para Importação

### 2.1 Estrutura Básica
```json
{
  "subject": "string",
  "theme": "string?",
  "topic": "string?",
  "text": "string",
  "option_a": "string",
  "option_b": "string",
  "option_c": "string",
  "option_d": "string",
  "option_e": "string",
  "correct_answer": "A-E",
  "explanation": "string",
  "difficulty": "Fácil|Médio|Difícil",
  "image_url": "string?",
  "is_from_previous_exam": boolean?,
  "exam_year": number?,
  "exam_name": "string?"
}
```

### 2.2 Validações
- Matéria deve estar cadastrada no sistema
- Tema e tópico devem seguir hierarquia existente
- Resposta correta deve ser A, B, C, D ou E
- Dificuldade deve ser Fácil, Médio ou Difícil
- URLs de imagem devem ser válidas e acessíveis

## 3. Políticas de Segurança

### 3.1 RLS (Row Level Security)
- Estudantes só acessam suas próprias respostas
- Questões são visíveis para todos usuários ativos
- Administradores têm acesso total ao sistema
- Sessões de estudo são privadas por estudante

### 3.2 Validações de Dados
- Emails únicos por usuário
- Senhas com requisitos mínimos de segurança
- Formato padronizado para questões
- Validação de integridade nas importações

## 4. Backup e Manutenção

### 4.1 Estratégia de Backup
- Backup diário do banco completo
- Backup incremental a cada 6 horas
- Retenção de 30 dias
- Exportação mensal para arquivo

### 4.2 Manutenção
- Limpeza de sessões inativas
- Otimização de índices
- Monitoramento de performance
- Logs de operações críticas