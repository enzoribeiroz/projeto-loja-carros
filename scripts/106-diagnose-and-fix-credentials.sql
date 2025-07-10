-- DIAGNÓSTICO COMPLETO E CORREÇÃO DE CREDENCIAIS

-- 1. VERIFICAR ESTADO ATUAL
SELECT '=== DIAGNÓSTICO INICIAL ===' as status;

-- Verificar usuários em auth.users
SELECT 
    'AUTH.USERS' as tabela,
    email,
    id,
    email_confirmed_at IS NOT NULL as email_confirmado,
    encrypted_password IS NOT NULL as tem_senha,
    LENGTH(encrypted_password) as tamanho_senha
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

-- Verificar usuários em public.users
SELECT 
    'PUBLIC.USERS' as tabela,
    email,
    id,
    is_admin,
    profile_complete
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

-- 2. TESTAR SENHAS ATUAIS
SELECT 
    'TESTE SENHAS ATUAIS' as tipo,
    email,
    CASE 
        WHEN email = 'caio@caio.com' THEN
            CASE WHEN encrypted_password = crypt('6464', encrypted_password) THEN '✅ Senha 6464 OK' ELSE '❌ Senha 6464 FALHA' END
        WHEN email = 'test1@test.com' THEN
            CASE WHEN encrypted_password = crypt('test123', encrypted_password) THEN '✅ Senha test123 OK' ELSE '❌ Senha test123 FALHA' END
        ELSE 'Email não reconhecido'
    END as resultado_teste
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 3. CORRIGIR SENHAS SE NECESSÁRIO
DO $$
DECLARE
    admin_count int;
    test_count int;
BEGIN
    -- Contar usuários existentes
    SELECT COUNT(*) INTO admin_count FROM auth.users WHERE email = 'caio@caio.com';
    SELECT COUNT(*) INTO test_count FROM auth.users WHERE email = 'test1@test.com';
    
    RAISE NOTICE '📊 Admin count: %, Test count: %', admin_count, test_count;
    
    -- Corrigir senha do admin se existir
    IF admin_count > 0 THEN
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('6464', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE email = 'caio@caio.com';
        RAISE NOTICE '✅ Senha do admin atualizada para: 6464';
    END IF;
    
    -- Corrigir senha do usuário teste se existir
    IF test_count > 0 THEN
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('test123', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW()
        WHERE email = 'test1@test.com';
        RAISE NOTICE '✅ Senha do usuário teste atualizada para: test123';
    END IF;
    
    -- Se não existirem, criar do zero
    IF admin_count = 0 THEN
        RAISE NOTICE '🆕 Criando usuário admin do zero...';
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'caio@caio.com',
            crypt('6464', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Caio Admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE '✅ Admin criado com senha: 6464';
    END IF;
    
    IF test_count = 0 THEN
        RAISE NOTICE '🆕 Criando usuário teste do zero...';
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'test1@test.com',
            crypt('test123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"name":"Test User"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE '✅ Usuário teste criado com senha: test123';
    END IF;
    
END $$;

-- 4. SINCRONIZAR TABELA PUBLIC.USERS
DO $$
DECLARE
    auth_admin_id uuid;
    auth_test_id uuid;
BEGIN
    -- Pegar IDs da tabela auth
    SELECT id INTO auth_admin_id FROM auth.users WHERE email = 'caio@caio.com';
    SELECT id INTO auth_test_id FROM auth.users WHERE email = 'test1@test.com';
    
    -- Sincronizar admin
    IF auth_admin_id IS NOT NULL THEN
        INSERT INTO users (id, email, name, phone, is_admin, profile_complete, created_at, updated_at)
        VALUES (auth_admin_id, 'caio@caio.com', 'Caio Admin', '', true, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            is_admin = EXCLUDED.is_admin,
            profile_complete = EXCLUDED.profile_complete,
            updated_at = NOW();
        RAISE NOTICE '✅ Admin sincronizado na tabela public.users';
    END IF;
    
    -- Sincronizar usuário teste
    IF auth_test_id IS NOT NULL THEN
        INSERT INTO users (id, email, name, phone, is_admin, profile_complete, created_at, updated_at)
        VALUES (auth_test_id, 'test1@test.com', 'Test User', '', false, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            is_admin = EXCLUDED.is_admin,
            profile_complete = EXCLUDED.profile_complete,
            updated_at = NOW();
        RAISE NOTICE '✅ Usuário teste sincronizado na tabela public.users';
    END IF;
    
END $$;

-- 5. VERIFICAÇÃO FINAL
SELECT '=== VERIFICAÇÃO FINAL ===' as status;

-- Contar usuários
SELECT 
    'CONTAGEM FINAL' as tipo,
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com')) as auth_count,
    (SELECT COUNT(*) FROM users WHERE email IN ('caio@caio.com', 'test1@test.com')) as public_count;

-- Testar senhas novamente
SELECT 
    'TESTE SENHAS FINAL' as tipo,
    email,
    CASE 
        WHEN email = 'caio@caio.com' THEN
            CASE WHEN encrypted_password = crypt('6464', encrypted_password) THEN '✅ Senha 6464 FUNCIONANDO' ELSE '❌ Senha 6464 AINDA FALHA' END
        WHEN email = 'test1@test.com' THEN
            CASE WHEN encrypted_password = crypt('test123', encrypted_password) THEN '✅ Senha test123 FUNCIONANDO' ELSE '❌ Senha test123 AINDA FALHA' END
        ELSE 'Email não reconhecido'
    END as resultado_final
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

-- Verificar confirmação de email
SELECT 
    'CONFIRMAÇÃO EMAIL' as tipo,
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
        ELSE '❌ Email NÃO confirmado'
    END as status_confirmacao
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

-- Mostrar detalhes completos
SELECT 
    'DETALHES COMPLETOS' as tipo,
    email,
    id,
    email_confirmed_at,
    LENGTH(encrypted_password) as tamanho_senha_hash,
    raw_user_meta_data,
    created_at,
    updated_at
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

SELECT '=== DIAGNÓSTICO CONCLUÍDO ===' as final_status;
SELECT 'Agora teste os logins na aplicação!' as instrucao;
