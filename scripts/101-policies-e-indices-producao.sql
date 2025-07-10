-- =====================================================
-- POLICIES E ÍNDICES RECOMENDADOS PARA PRODUÇÃO
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. ATIVAR RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. REMOVER POLICIES ANTIGAS
DROP POLICY IF EXISTS "vehicles_select_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_insert_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_update_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_delete_policy" ON vehicles;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;

-- 3. CRIAR POLICIES OTIMIZADAS
-- Qualquer usuário autenticado pode ler veículos
CREATE POLICY "vehicles_select_policy" ON vehicles
  FOR SELECT USING (true);
-- Apenas autenticados podem inserir
CREATE POLICY "vehicles_insert_policy" ON vehicles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Apenas autenticados podem atualizar veículos que criou
CREATE POLICY "vehicles_update_policy" ON vehicles
  FOR UPDATE USING (auth.uid() = created_by);
-- Apenas autenticados podem deletar veículos que criou
CREATE POLICY "vehicles_delete_policy" ON vehicles
  FOR DELETE USING (auth.uid() = created_by);

-- Usuário só pode ver/editar seu próprio perfil
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. ÍNDICES RECOMENDADOS
CREATE INDEX IF NOT EXISTS vehicles_created_by_idx ON vehicles(created_by);
CREATE INDEX IF NOT EXISTS vehicles_is_active_idx ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- 5. VERIFICAÇÃO FINAL
SELECT * FROM pg_policies WHERE schemaname = 'public';
SELECT * FROM pg_indexes WHERE schemaname = 'public';
-- =====================================================
-- FIM DO SCRIPT
-- ===================================================== 