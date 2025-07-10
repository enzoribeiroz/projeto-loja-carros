# Guia de Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Escolha uma organização
6. Preencha:
   - **Name**: AutoMax Concessionária
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
7. Clique em "Create new project"

## 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: https://abc123.supabase.co)
   - **anon/public key** (chave longa começando com "eyJ...")

## 3. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
\`\`\`

2. Substitua pelos valores copiados do Supabase

## 4. Executar Scripts SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Execute os scripts na seguinte ordem:

### Script 1: Criar Tabelas
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/01-create-tables.sql
\`\`\`

### Script 2: Configurar Políticas RLS
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/02-create-policies.sql
\`\`\`

### Script 3: Criar Funções
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/05-create-auth-functions.sql
\`\`\`

## 5. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** → **Settings**
2. Configure:
   - **Site URL**: http://localhost:3000 (desenvolvimento)
   - **Redirect URLs**: http://localhost:3000/auth/callback

## 6. Criar Usuário Admin

1. No painel do Supabase, vá em **Authentication** → **Users**
2. Clique em "Add user"
3. Preencha:
   - **Email**: caio@caio.com
   - **Password**: 6464
   - **Email Confirm**: true
4. Clique em "Create user"

## 7. Testar Integração

1. Inicie o projeto: `npm run dev`
2. Acesse: http://localhost:3000/admin/supabase-setup
3. Verifique se todos os status estão "OK"
4. Clique em "Configurar" para inserir dados iniciais

## 8. Fazer Login

1. Acesse: http://localhost:3000/login
2. Use as credenciais:
   - **Email**: caio@caio.com
   - **Password**: 6464

## Solução de Problemas

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de Autenticação
- Verifique se o usuário foi criado no painel do Supabase
- Confirme se as políticas RLS foram aplicadas

### Erro de Permissão
- Verifique se o usuário tem `is_admin = true` na tabela `users`
- Execute o script de criação de funções

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
