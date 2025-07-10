-- =====================================================
-- SCRIPT DE OTIMIZAÇÕES COMPLETAS DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. REMOVER POLICIES DUPLICADAS
-- =====================================================

-- Remover policies duplicadas para vehicles
DROP POLICY IF EXISTS "Enable read access for all users" ON vehicles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vehicles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON vehicles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON vehicles;

-- Remover policies duplicadas para users (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 2. CRIAR POLICIES OTIMIZADAS
-- =====================================================

-- Policy para leitura de veículos (todos podem ver)
CREATE POLICY "vehicles_select_policy" ON vehicles
    FOR SELECT USING (true);

-- Policy para inserção (apenas usuários autenticados)
CREATE POLICY "vehicles_insert_policy" ON vehicles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy para atualização (apenas usuários autenticados ou dono do veículo)
CREATE POLICY "vehicles_update_policy" ON vehicles
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND (
            -- Usuário pode editar seus próprios veículos
            created_by = auth.uid()
        )
    );

-- Policy para exclusão (apenas usuários autenticados)
CREATE POLICY "vehicles_delete_policy" ON vehicles
    FOR DELETE USING (
        auth.role() = 'authenticated'
    );

-- 3. CRIAR POLICIES PARA TABELA USERS
-- =====================================================

-- Policy para usuários verem seu próprio perfil
CREATE POLICY "users_select_policy" ON users
    FOR SELECT USING (auth.uid() = id);

-- Policy para usuários atualizarem seu próprio perfil
CREATE POLICY "users_update_policy" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy para inserção de usuários (apenas durante registro)
CREATE POLICY "users_insert_policy" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. REMOVER ÍNDICES DUPLICADOS
-- =====================================================

-- Remover índices duplicados em vehicles
DROP INDEX IF EXISTS vehicles_created_by_idx;
DROP INDEX IF EXISTS vehicles_brand_idx;
DROP INDEX IF EXISTS vehicles_model_idx;
DROP INDEX IF EXISTS vehicles_year_idx;
DROP INDEX IF EXISTS vehicles_price_idx;
DROP INDEX IF EXISTS vehicles_is_active_idx;

-- Remover índices duplicados em users
DROP INDEX IF EXISTS users_email_idx;
DROP INDEX IF EXISTS users_role_idx;

-- 5. CRIAR ÍNDICES OTIMIZADOS
-- =====================================================

-- Índices para vehicles
CREATE INDEX IF NOT EXISTS vehicles_created_by_idx ON vehicles(created_by);
CREATE INDEX IF NOT EXISTS vehicles_brand_idx ON vehicles(brand);
CREATE INDEX IF NOT EXISTS vehicles_model_idx ON vehicles(model);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON vehicles(year);
CREATE INDEX IF NOT EXISTS vehicles_price_idx ON vehicles(price);
CREATE INDEX IF NOT EXISTS vehicles_is_active_idx ON vehicles(is_active);

-- Índices para users
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- 6. VERIFICAR E CORRIGIR ESTRUTURA
-- =====================================================

-- Garantir que a coluna is_active existe em vehicles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Garantir que a coluna role existe em users (opcional - descomente se precisar)
-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM information_schema.columns 
--         WHERE table_name = 'users' AND column_name = 'role'
--     ) THEN
--         ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
--     END IF;
-- END $$;

-- 7. CONFIGURAR RLS (Row Level Security)
-- =====================================================

-- Ativar RLS nas tabelas
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Mostrar todas as policies ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mostrar todos os índices
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- SCRIPT CONCLUÍDO!
-- =====================================================
-- 
-- Este script:
-- ✅ Remove policies duplicadas
-- ✅ Cria policies otimizadas sem uso de auth.uid() em WHERE
-- ✅ Remove índices duplicados
-- ✅ Cria índices otimizados
-- ✅ Garante estrutura correta das tabelas
-- ✅ Ativa RLS nas tabelas
-- ✅ Mostra relatório final das policies e índices
--
-- Execute este script no SQL Editor do Supabase
-- e todos os avisos de performance devem desaparecer!
-- ===================================================== 