-- =====================================================
-- VERIFICAR TABELAS EXISTENTES
-- Execute este script primeiro para ver o que já existe
-- =====================================================

-- Verificar tabelas existentes
SELECT '=== TABELAS EXISTENTES ===' as section;
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se RLS está habilitado
SELECT '=== RLS HABILITADO ===' as section;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar políticas existentes
SELECT '=== POLÍTICAS EXISTENTES ===' as section;
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verificar dados existentes
SELECT '=== DADOS EXISTENTES ===' as section;
SELECT 
    'users' as table_name,
    COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
    'vehicles' as table_name,
    COUNT(*) as record_count
FROM public.vehicles
UNION ALL
SELECT 
    'vehicle_images' as table_name,
    COUNT(*) as record_count
FROM public.vehicle_images
UNION ALL
SELECT 
    'vehicle_features' as table_name,
    COUNT(*) as record_count
FROM public.vehicle_features
UNION ALL
SELECT 
    'favorites' as table_name,
    COUNT(*) as record_count
FROM public.favorites
UNION ALL
SELECT 
    'contacts' as table_name,
    COUNT(*) as record_count
FROM public.contacts
UNION ALL
SELECT 
    'seller_info' as table_name,
    COUNT(*) as record_count
FROM public.seller_info;

-- Verificar funções existentes
SELECT '=== FUNÇÕES EXISTENTES ===' as section;
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name; 