# 🚀 CONFIGURAÇÃO COMPLETA DO SUPABASE

## 📋 CHECKLIST DE CONFIGURAÇÃO

### 1. 🔧 VARIÁVEIS DE AMBIENTE (.env.local)
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA

# Opcional: Para funcionalidades avançadas
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE
\`\`\`

### 2. 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

#### Passo 1: Execute o Script Principal
1. Acesse o **SQL Editor** no painel do Supabase
2. Cole e execute o script `00-complete-supabase-setup.sql`
3. Aguarde a execução completa (pode demorar alguns minutos)

#### Passo 2: Verificar Tabelas Criadas
\`\`\`sql
-- Verificar se todas as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
\`\`\`

**Tabelas esperadas:**
- ✅ users
- ✅ vehicles  
- ✅ vehicle_images
- ✅ vehicle_features
- ✅ favorites
- ✅ contacts
- ✅ seller_info

### 3. 🔐 CONFIGURAÇÃO DE AUTENTICAÇÃO

#### No painel do Supabase:
1. **Authentication → Settings**
2. **Site URL:** `http://localhost:3000` (desenvolvimento)
3. **Redirect URLs:** 
   - `http://localhost:3000/auth/callback`
   - `https://seudominio.com/auth/callback` (produção)

#### Criar Usuário Admin:
1. **Authentication → Users → Add User**
2. **Email:** `caio@caio.com`
3. **Password:** `6464`
4. **Confirm Password:** `6464`
5. ✅ **Email Confirmed**

### 4. 🔄 CONFIGURAÇÃO DE REALTIME

#### Habilitar Realtime:
1. **Settings → API**
2. **Realtime → Enable**
3. **Tables:** Selecionar todas as tabelas públicas

#### Verificar Realtime:
\`\`\`sql
-- Verificar se realtime está habilitado
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
\`\`\`

### 5. 🛡️ CONFIGURAÇÃO DE SEGURANÇA (RLS)

#### Verificar Políticas RLS:
\`\`\`sql
-- Listar todas as políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
\`\`\`

**Políticas esperadas por tabela:**
- **users:** 3 políticas (SELECT, UPDATE, INSERT)
- **vehicles:** 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- **vehicle_images:** 2 políticas (SELECT, ALL)
- **vehicle_features:** 2 políticas (SELECT, ALL)
- **favorites:** 2 políticas (SELECT, ALL)
- **contacts:** 2 políticas (INSERT, SELECT)
- **seller_info:** 2 políticas (SELECT, ALL)

### 6. 📊 POPULAR DADOS DE TESTE

\`\`\`sql
-- Inserir veículos de exemplo
INSERT INTO public.vehicles (name, brand, model, year, price, fuel, transmission, color, description, tag, category) VALUES
('Honda Civic 2023', 'Honda', 'Civic', 2023, 95000.00, 'Flex', 'Automático', 'Branco', 'Sedan executivo com tecnologia avançada', 'NOVO', 'novos'),
('Toyota Corolla 2022', 'Toyota', 'Corolla', 2022, 85000.00, 'Flex', 'CVT', 'Prata', 'Sedan confiável e econômico', 'SEMINOVO', 'seminovos'),
('BMW X3 2021', 'BMW', 'X3', 2021, 180000.00, 'Gasolina', 'Automático', 'Preto', 'SUV premium com performance excepcional', 'PREMIUM', 'premium'),
('Volkswagen Gol 2020', 'Volkswagen', 'Gol', 2020, 45000.00, 'Flex', 'Manual', 'Vermelho', 'Compacto ideal para cidade', 'OFERTA ESPECIAL', 'ofertas');

-- Inserir imagens para os veículos
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary) 
SELECT id, '/placeholder.svg?height=400&width=600', true 
FROM public.vehicles;

-- Inserir características
INSERT INTO public.vehicle_features (vehicle_id, feature)
SELECT v.id, f.feature
FROM public.vehicles v
CROSS JOIN (
    VALUES 
    ('Ar condicionado'),
    ('Direção hidráulica'),
    ('Vidros elétricos'),
    ('Trava elétrica'),
    ('Airbag duplo')
) AS f(feature);
\`\`\`

### 7. 🧪 TESTES DE FUNCIONALIDADE

#### Teste 1: Conexão
\`\`\`javascript
// No console do navegador
const { data, error } = await supabase.from('vehicles').select('count');
console.log('Conexão:', error ? 'ERRO' : 'OK', data);
\`\`\`

#### Teste 2: Autenticação
\`\`\`javascript
// Teste de login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'caio@caio.com',
  password: '6464'
});
console.log('Login:', error ? 'ERRO' : 'OK', data);
\`\`\`

#### Teste 3: Realtime
\`\`\`javascript
// Teste de realtime
const channel = supabase
  .channel('test-channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, 
     (payload) => console.log('Realtime funcionando:', payload))
  .subscribe();
\`\`\`

### 8. 🚀 CONFIGURAÇÃO DE PRODUÇÃO

#### Variáveis de Ambiente de Produção:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
\`\`\`

#### URLs de Redirecionamento:
- Adicionar domínio de produção nas configurações de Auth
- Configurar CORS se necessário

### 9. 📈 MONITORAMENTO

#### Logs importantes para acompanhar:
- **Authentication → Logs:** Logins e registros
- **Database → Logs:** Queries e erros
- **Realtime → Logs:** Conexões em tempo real

### 10. 🔧 TROUBLESHOOTING

#### Problemas Comuns:

**❌ "relation does not exist"**
- Executar novamente o script de criação de tabelas

**❌ "permission denied for table"**
- Verificar políticas RLS
- Confirmar se usuário está autenticado

**❌ "realtime not working"**
- Verificar se tabelas estão na publicação realtime
- Confirmar configuração de realtime no painel

**❌ "login slow"**
- Verificar índices no banco
- Confirmar configuração de rede

## ✅ CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas
- [ ] Script SQL executado com sucesso
- [ ] Usuário admin criado
- [ ] Realtime habilitado
- [ ] Políticas RLS funcionando
- [ ] Dados de teste inseridos
- [ ] Testes de conexão OK
- [ ] Testes de autenticação OK
- [ ] Testes de realtime OK

## 🎯 RESULTADO ESPERADO

Após seguir todos os passos:
- ✅ Login rápido (< 2 segundos)
- ✅ Cadastro funcionando
- ✅ Alteração de senha funcionando
- ✅ Veículos carregando em tempo real
- ✅ Favoritos sincronizando
- ✅ Admin panel funcional
- ✅ Todas as páginas responsivas
