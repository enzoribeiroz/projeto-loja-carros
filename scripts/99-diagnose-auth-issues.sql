-- DIAGNÓSTICO COMPLETO DE AUTENTICAÇÃO
-- Execute este script para identificar problemas

-- 1. Verificar se as tabelas existem
SELECT 'VERIFICAÇÃO DE TABELAS' as tipo;
SELECT 
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ EXISTE' ELSE '❌ NÃO EXISTE' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'vehicles')
ORDER BY table_name;

-- 2. Verificar usuários na tabela auth
SELECT 'USUÁRIOS AUTH' as tipo;
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ CONFIRMADO'
        ELSE '❌ NÃO CONFIRMADO'
    END as status_email
FROM auth.users
ORDER BY created_at DESC;

-- 3. Verificar usuários na tabela public
SELECT 'USUÁRIOS PUBLIC' as tipo;
SELECT 
    id,
    email,
    name,
    is_admin,
    profile_complete,
    created_at
FROM public.users
ORDER BY created_at DESC;

-- 4. Verificar sincronização entre auth e public
SELECT 'SINCRONIZAÇÃO AUTH <-> PUBLIC' as tipo;
SELECT 
    COALESCE(a.email, p.email) as email,
    CASE WHEN a.id IS NOT NULL THEN '✅' ELSE '❌' END as auth_existe,
    CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌' END as public_existe,
    CASE 
        WHEN a.id IS NOT NULL AND p.id IS NOT NULL THEN '✅ SINCRONIZADO'
        WHEN a.id IS NOT NULL AND p.id IS NULL THEN '❌ FALTA PUBLIC'
        WHEN a.id IS NULL AND p.id IS NOT NULL THEN '❌ FALTA AUTH'
        ELSE '❌ ERRO'
    END as status_sync
FROM auth.users a
FULL OUTER JOIN public.users p ON a.id = p.id
ORDER BY COALESCE(a.created_at, p.created_at) DESC;

-- 5. Verificar políticas RLS
SELECT 'POLÍTICAS RLS' as tipo;
SELECT 
    tablename,
    policyname,
    cmd,
    CASE WHEN qual IS NOT NULL THEN '✅ COM CONDIÇÃO' ELSE '❌ SEM CONDIÇÃO' END as status
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY tablename, policyname;

-- 6. Verificar triggers
SELECT 'TRIGGERS' as tipo;
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    CASE WHEN trigger_name IS NOT NULL THEN '✅ ATIVO' ELSE '❌ INATIVO' END as status
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth'
ORDER BY trigger_name;

-- 7. Testar inserção manual
SELECT 'TESTE DE INSERÇÃO' as tipo;
-- Este comando vai falhar se houver problemas de permissão
-- INSERT INTO public.users (id, email, name) VALUES (uuid_generate_v4(), 'teste@teste.com', 'Teste');

-- 8. Verificar configurações de email
SELECT 'CONFIGURAÇÕES AUTH' as tipo;
SELECT 
    'Email confirmation' as config,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email_confirmed_at IS NULL) 
        THEN '❌ ALGUNS NÃO CONFIRMADOS'
        ELSE '✅ TODOS CONFIRMADOS'
    END as status;
