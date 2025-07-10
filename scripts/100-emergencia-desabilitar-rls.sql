-- =====================================================
-- SCRIPT DE EMERGÊNCIA - DESABILITAR RLS TEMPORARIAMENTE
-- Execute este script no SQL Editor do Supabase para resolver carregamento infinito
-- =====================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE
-- =====================================================

-- Desabilitar RLS na tabela vehicles
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS na tabela users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLICIES PROBLEMÁTICAS
-- =====================================================

-- Remover todas as policies de vehicles
DROP POLICY IF EXISTS "vehicles_select_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_insert_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_update_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_delete_policy" ON vehicles;

-- Remover todas as policies de users
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;

-- 3. VERIFICAR STATUS
-- =====================================================

-- Verificar se RLS está desabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('vehicles', 'users');

-- Verificar se não há policies ativas
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SITE DEVE FUNCIONAR AGORA!
-- =====================================================
-- 
-- Este script:
-- ✅ Desabilita RLS nas tabelas
-- ✅ Remove todas as policies
-- ✅ Permite acesso total aos dados
-- ✅ Resolve carregamento infinito
--
-- ⚠️  ATENÇÃO: Isso remove toda a segurança!
--     Use apenas temporariamente para resolver o problema
--     Depois podemos recriar as policies corretamente
-- ===================================================== 