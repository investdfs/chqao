# Documentação de Reconstrução do Sistema CHQAO

## Índice
1. [Histórico e Visão Geral](#1-histórico-e-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Configuração Inicial](#3-configuração-inicial)
4. [Implementação Passo a Passo](#4-implementação-passo-a-passo)
5. [Funcionalidades Específicas](#5-funcionalidades-específicas)
6. [Testes e Validação](#6-testes-e-validação)

## 1. Histórico e Visão Geral

### 1.1 Contexto do Projeto
O sistema CHQAO foi desenvolvido para auxiliar militares na preparação para o Curso de Habilitação ao Quadro Auxiliar de Oficiais (CHQAO). Este projeto nasceu da necessidade de uma plataforma dedicada e especializada que pudesse oferecer:

- Prática consistente de questões
- Acompanhamento de progresso
- Feedback instantâneo
- Organização do conteúdo por matérias
- Gestão eficiente do tempo de estudo

### 1.2 Feedbacks Importantes
Durante o desenvolvimento e uso inicial, recebemos feedbacks cruciais:

1. Necessidade de interface intuitiva e responsiva
2. Importância do feedback imediato nas questões
3. Valor do acompanhamento estatístico
4. Demanda por questões de qualidade
5. Necessidade de gestão eficiente do banco de questões

### 1.3 Objetivos Principais
- Facilitar o estudo sistemático
- Proporcionar experiência similar à prova real
- Permitir gestão eficiente do conteúdo
- Fornecer estatísticas detalhadas de desempenho
- Garantir segurança e controle de acesso

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica
- Frontend: React + TypeScript
- Estilização: Tailwind CSS + Shadcn/UI
- Backend: Supabase
- Gerenciamento de Estado: TanStack Query
- Roteamento: React Router
- Processamento de Planilhas: XLSX

### 2.2 Estrutura de Banco de Dados

#### 2.2.1 Tabelas Principais
1. `admins`
   - Gerenciamento de administradores
   - Campos: id, email, name, password, status, created_at

2. `students`
   - Gerenciamento de estudantes
   - Campos: id, email, name, password, status, created_at

3. `questions`
   - Banco de questões
   - Campos: id, subject, topic, text, options (a-e), correct_answer, explanation, etc.

4. `subject_structure`
   - Organização hierárquica do conteúdo
   - Campos: id, theme, subject, topic, level, parent_id, etc.

### 2.3 Políticas de Segurança (RLS)
Implementação cuidadosa de políticas Row Level Security para:
- Proteção de dados sensíveis
- Controle de acesso por perfil
- Isolamento de dados entre usuários

## 3. Configuração Inicial

### 3.1 Preparação do Ambiente Supabase

1. Criar novo projeto no Supabase
2. Configurar autenticação:
   - Habilitar auth providers
   - Configurar emails de confirmação
   - Definir redirecionamentos

3. Configurar banco de dados:
   ```sql
   -- Criar tipos enumerados
   CREATE TYPE admin_status AS ENUM ('active', 'blocked');
   CREATE TYPE student_status AS ENUM ('active', 'blocked');
   CREATE TYPE question_difficulty AS ENUM ('Fácil', 'Médio', 'Difícil');
   
   -- Criar tabelas principais
   CREATE TABLE admins (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT NOT NULL UNIQUE,
     name TEXT NOT NULL DEFAULT '',
     password TEXT NOT NULL,
     status admin_status DEFAULT 'active',
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   -- ... continuar com outras tabelas
   ```

4. Implementar políticas RLS:
   ```sql
   -- Políticas para admins
   CREATE POLICY "Administradores podem ler" ON admins
     FOR SELECT USING (auth.jwt() ->> 'email' = email);
   
   -- ... continuar com outras políticas
   ```

### 3.2 Configuração do Projeto Frontend

1. Inicializar projeto React com Vite
2. Instalar dependências necessárias:
   ```bash
   npm install @tanstack/react-query @supabase/supabase-js react-router-dom
   ```

3. Configurar Tailwind CSS e Shadcn/UI
4. Estruturar diretórios do projeto

## 4. Implementação Passo a Passo

### 4.1 Autenticação e Autorização

1. Implementar páginas de login/registro
2. Configurar rotas protegidas
3. Implementar gerenciamento de sessão
4. Criar componentes de navegação autenticada

### 4.2 Dashboard do Administrador

1. Criar interface de gestão de usuários
2. Implementar upload de questões
3. Desenvolver visualização de estatísticas
4. Criar sistema de reset de banco

### 4.3 Área do Estudante

1. Implementar prática de questões
2. Criar dashboard de progresso
3. Desenvolver filtros de estudo
4. Implementar feedback de questões

### 4.4 Gestão de Questões

1. Criar sistema de importação Excel
2. Implementar validações de dados
3. Desenvolver preview de questões
4. Criar sistema de backup

## 5. Funcionalidades Específicas

### 5.1 Sistema de Importação de Questões

#### 5.1.1 Estrutura do Excel
- Definir colunas obrigatórias
- Implementar validações
- Criar template padrão

#### 5.1.2 Processamento
1. Upload do arquivo
2. Validação do formato
3. Processamento linha a linha
4. Feedback de sucesso/erro

### 5.2 Sistema de Prática

#### 5.2.1 Modos de Estudo
1. Modo Normal
   - Feedback imediato
   - Explicações detalhadas
   - Estatísticas por questão

2. Modo Prova
   - Simulação de ambiente de prova
   - Tempo controlado
   - Feedback apenas ao final

### 5.3 Sistema de Estatísticas

#### 5.3.1 Métricas Principais
1. Taxa de acerto por matéria
2. Tempo de estudo
3. Questões respondidas
4. Progresso no conteúdo

#### 5.3.2 Visualizações
1. Gráficos de progresso
2. Heatmap de atividade
3. Distribuição de erros/acertos

## 6. Testes e Validação

### 6.1 Testes Funcionais
1. Fluxos de autenticação
2. Upload de questões
3. Prática de questões
4. Geração de estatísticas

### 6.2 Validações de Segurança
1. Políticas RLS
2. Autenticação
3. Autorização
4. Proteção de rotas

### 6.3 Testes de Performance
1. Carregamento de questões
2. Processamento de planilhas
3. Geração de relatórios

## Considerações Finais

### Manutenção
1. Backup regular do banco de dados
2. Monitoramento de logs
3. Atualização de dependências
4. Verificação de segurança

### Melhorias Futuras
1. Implementação de IA para geração de questões
2. Sistema de comentários
3. Modo offline
4. App mobile

### Documentação Adicional
1. API endpoints
2. Estrutura de dados
3. Fluxos de usuário
4. Guias de troubleshooting