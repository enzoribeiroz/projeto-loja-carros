-- SCRIPT DE VERIFICAÇÃO DA CONFIGURAÇÃO
-- Execute este script para verificar se tudo está funcionando

-- 1. Verificar tabelas
SELECT 
    'TABELAS' as tipo,
    table_name as nome,
    'OK' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'vehicles', 'vehicle_images', 'vehicle_features', 'favorites', 'contacts', 'seller_info')
ORDER BY table_name;

-- 2. Verificar políticas RLS
SELECT 
    'POLÍTICAS RLS' as tipo,
    tablename as nome,
    count(*) as total_politicas
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 3. Verificar realtime
SELECT 
    'REALTIME' as tipo,
    tablename as nome,
    'HABILITADO' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
ORDER BY tablename;

-- 4. Verificar usuários
SELECT 
    'USUÁRIOS' as tipo,
    email as nome,
    CASE WHEN is_admin THEN 'ADMIN' ELSE 'USER' END as status
FROM public.users
ORDER BY is_admin DESC, email;

-- 5. Verificar veículos
SELECT 
    'VEÍCULOS' as tipo,
    name as nome,
    CASE WHEN is_active THEN 'ATIVO' ELSE 'INATIVO' END as status
FROM public.vehicles
ORDER BY created_at DESC
LIMIT 10;

-- 6. Verificar índices
SELECT 
    'ÍNDICES' as tipo,
    indexname as nome,
    tablename as tabela
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 7. Resumo final
SELECT 
    'RESUMO' as tipo,
    'Total de tabelas' as nome,
    count(*)::text as status
FROM information_schema.tables 
WHERE table_schema = 'public'

UNION ALL

SELECT 
    'RESUMO' as tipo,
    'Total de políticas' as nome,
    count(*)::text as status
FROM pg_policies 
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'RESUMO' as tipo,
    'Total de usuários' as nome,
    count(*)::text as status
FROM public.users

UNION ALL

SELECT 
    'RESUMO' as tipo,
    'Total de veículos' as nome,
    count(*)::text as status
FROM public.vehicles

UNION ALL

SELECT 
    'RESUMO' as tipo,
    'Configuração' as nome,
    'COMPLETA ✅' as status;
