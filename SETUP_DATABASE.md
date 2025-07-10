# Configuração Completa do Banco de Dados Supabase

Este documento contém todos os comandos SQL necessários para configurar completamente o banco de dados da concessionária no Supabase.

## 📋 Pré-requisitos

1. Acesso ao painel do Supabase
2. Projeto Supabase ativo
3. Acesso ao SQL Editor

## 🚀 Passos para Configuração

### Passo 1: Configuração Inicial do Banco

1. Acesse o **SQL Editor** no painel do Supabase
2. Execute o script `setup-complete-database.sql`
3. Aguarde a execução completa

### Passo 2: Popular Dados de Teste

1. Execute o script `populate-test-data.sql`
2. Aguarde a inserção dos dados

### Passo 3: Verificar Configuração

1. Execute o script `verify-database-setup.sql`
2. Confirme que todos os itens estão funcionando

## 📁 Arquivos SQL Criados

### 1. `setup-complete-database.sql`
**Função:** Configuração completa do banco de dados

**Inclui:**
- ✅ Extensões necessárias (uuid-ossp, pgcrypto)
- ✅ Todas as tabelas principais
- ✅ Índices para performance
- ✅ Row Level Security (RLS)
- ✅ Políticas de segurança
- ✅ Funções e triggers
- ✅ Configuração de realtime
- ✅ Dados iniciais do vendedor

**Tabelas criadas:**
- `users` - Perfis de usuários
- `vehicles` - Veículos da concessionária
- `vehicle_images` - Imagens dos veículos
- `vehicle_features` - Características dos veículos
- `favorites` - Favoritos dos usuários
- `contacts` - Mensagens de contato
- `seller_info` - Informações do vendedor

### 2. `populate-test-data.sql`
**Função:** Popular dados de teste

**Inclui:**
- ✅ 10 veículos de teste (novos, seminovos, premium)
- ✅ Imagens para cada veículo
- ✅ Características detalhadas
- ✅ Diferentes categorias e tags

### 3. `verify-database-setup.sql`
**Função:** Verificar se tudo está funcionando

**Verifica:**
- ✅ Extensões instaladas
- ✅ Tabelas criadas
- ✅ RLS habilitado
- ✅ Políticas configuradas
- ✅ Índices criados
- ✅ Funções e triggers
- ✅ Dados inseridos
- ✅ Realtime configurado
- ✅ Chaves estrangeiras

## 🔧 Estrutura do Banco

### Tabela `vehicles`
```sql
- id (UUID, Primary Key)
- name (TEXT) - Nome do veículo
- brand (TEXT) - Marca
- model (TEXT) - Modelo
- year (INTEGER) - Ano
- price (DECIMAL) - Preço atual
- original_price (DECIMAL) - Preço original (para ofertas)
- mileage (INTEGER) - Quilometragem
- fuel (TEXT) - Tipo de combustível
- transmission (TEXT) - Transmissão
- color (TEXT) - Cor
- seats (INTEGER) - Número de assentos
- doors (INTEGER) - Número de portas
- engine (TEXT) - Motor
- fuel_consumption (TEXT) - Consumo
- warranty (TEXT) - Garantia
- condition (TEXT) - Estado
- description (TEXT) - Descrição
- tag (TEXT) - Tag (NOVO, SEMINOVO, etc.)
- category (TEXT) - Categoria
- location (TEXT) - Localização
- is_active (BOOLEAN) - Ativo/Inativo
- seller_id (UUID) - Referência ao vendedor
- created_by (UUID) - Usuário que criou
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela `vehicle_features`
```sql
- id (UUID, Primary Key)
- vehicle_id (UUID, Foreign Key) - Referência ao veículo
- feature (TEXT) - Característica
- created_at (TIMESTAMP)
```

### Tabela `vehicle_images`
```sql
- id (UUID, Primary Key)
- vehicle_id (UUID, Foreign Key) - Referência ao veículo
- image_url (TEXT) - URL da imagem
- is_primary (BOOLEAN) - Imagem principal
- display_order (INTEGER) - Ordem de exibição
- created_at (TIMESTAMP)
```

## 🔐 Segurança (RLS)

### Políticas Implementadas

**Veículos:**
- ✅ Todos podem visualizar veículos ativos
- ✅ Apenas admins podem inserir/editar/deletar

**Usuários:**
- ✅ Todos podem visualizar perfis
- ✅ Usuários podem editar apenas seu próprio perfil

**Favoritos:**
- ✅ Usuários podem gerenciar apenas seus favoritos

**Contatos:**
- ✅ Qualquer pessoa pode inserir contatos
- ✅ Apenas admins podem visualizar contatos

## 📊 Dados de Teste Incluídos

### Veículos de Teste
1. **Honda Civic 2023** - R$ 125.000 (Novo)
2. **Toyota Corolla 2022** - R$ 115.000 (Seminovo)
3. **BMW X3 2021** - R$ 280.000 (Premium)
4. **Volkswagen Polo 2022** - R$ 78.000 (Oferta)
5. **Hyundai HB20 2023** - R$ 75.000 (Novo)
6. **Jeep Compass 2023** - R$ 145.000 (Novo)
7. **Toyota Hilux 2023** - R$ 185.000 (Novo)
8. **Volkswagen T-Cross 2023** - R$ 95.000 (Novo)
9. **Renault Kwid 2023** - R$ 55.000 (Novo)
10. **BMW 320i 2023** - R$ 245.000 (Novo)

### Categorias
- `novos` - Veículos zero quilômetro
- `seminovos` - Veículos usados
- `premium` - Veículos de luxo
- `ofertas` - Veículos em promoção

### Tags
- `NOVO` - Veículos novos
- `SEMINOVO` - Veículos seminovos
- `PREMIUM` - Veículos premium
- `OFERTA ESPECIAL` - Veículos em oferta
- `DISPONÍVEL` - Veículos disponíveis

## 🚀 Funcionalidades Habilitadas

### Realtime
- ✅ Todas as tabelas habilitadas para realtime
- ✅ Atualizações em tempo real
- ✅ Sincronização automática

### Índices de Performance
- ✅ Índices em campos de busca
- ✅ Índices em campos de filtro
- ✅ Índices em chaves estrangeiras

### Triggers Automáticos
- ✅ Atualização automática de `updated_at`
- ✅ Criação automática de perfil de usuário
- ✅ Sincronização com auth.users

## 🔍 Como Verificar se Está Funcionando

1. Execute `verify-database-setup.sql`
2. Confirme que todas as seções mostram dados
3. Verifique se não há erros
4. Teste a aplicação em `localhost:3000`

## 🛠️ Solução de Problemas

### Erro: "Tabela não existe"
- Execute novamente `setup-complete-database.sql`

### Erro: "Política não encontrada"
- Execute novamente `setup-complete-database.sql`

### Erro: "Dados não aparecem"
- Execute `populate-test-data.sql`

### Erro: "Realtime não funciona"
- Verifique se o projeto Supabase está ativo
- Execute a seção de realtime do script principal

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o projeto Supabase está ativo
2. Execute o script de verificação
3. Confirme que todas as variáveis de ambiente estão configuradas
4. Reinicie o servidor Next.js

---

**Status:** ✅ Configuração completa pronta para uso
**Última atualização:** $(date) 