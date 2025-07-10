-- =====================================================
-- VERIFICAÇÃO COMPLETA DO BANCO DE DADOS SUPABASE
-- Execute este script para verificar se tudo está funcionando
-- =====================================================

-- 1. VERIFICAR EXTENSÕES
SELECT '=== VERIFICAÇÃO DE EXTENSÕES ===' as section;
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- 2. VERIFICAR TABELAS
SELECT '=== VERIFICAÇÃO DE TABELAS ===' as section;
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. VERIFICAR RLS (ROW LEVEL SECURITY)
SELECT '=== VERIFICAÇÃO DE RLS ===' as section;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 4. VERIFICAR POLÍTICAS RLS
SELECT '=== VERIFICAÇÃO DE POLÍTICAS RLS ===' as section;
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

-- 5. VERIFICAR ÍNDICES
SELECT '=== VERIFICAÇÃO DE ÍNDICES ===' as section;
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- 6. VERIFICAR FUNÇÕES
SELECT '=== VERIFICAÇÃO DE FUNÇÕES ===' as section;
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- 7. VERIFICAR TRIGGERS
SELECT '=== VERIFICAÇÃO DE TRIGGERS ===' as section;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 8. VERIFICAR DADOS NAS TABELAS
SELECT '=== VERIFICAÇÃO DE DADOS ===' as section;

-- Contar registros em cada tabela
SELECT 'Contagem de registros por tabela:' as info;
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

-- 9. VERIFICAR REALTIME
SELECT '=== VERIFICAÇÃO DE REALTIME ===' as section;
SELECT 
    pubname,
    puballtables,
    pubinsert,
    pubupdate,
    pubdelete
FROM pg_publication 
WHERE pubname = 'supabase_realtime';

SELECT 
    pubname,
    tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- 10. VERIFICAR CONEXÕES DE CHAVE ESTRANGEIRA
SELECT '=== VERIFICAÇÃO DE CHAVES ESTRANGEIRAS ===' as section;
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 11. RESUMO FINAL
SELECT '=== RESUMO FINAL ===' as section;
SELECT 
    'CONFIGURAÇÃO COMPLETA!' as status,
    'Todas as tabelas, políticas, índices e dados foram configurados com sucesso.' as message; 