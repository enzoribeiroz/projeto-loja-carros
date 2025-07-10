-- Limpar completamente e recriar usuários com UUIDs válidos

-- 1. LIMPAR TUDO PRIMEIRO
DO $$
BEGIN
    -- Deletar da tabela public primeiro (devido às foreign keys)
    DELETE FROM users WHERE email IN ('caio@caio.com', 'test1@test.com');
    
    -- Deletar da tabela auth (pode falhar se não existir, mas não importa)
    BEGIN
        DELETE FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Não foi possível deletar de auth.users (normal se não existir)';
    END;
    
    RAISE NOTICE 'Limpeza concluída!';
END $$;

-- 2. AGUARDAR UM MOMENTO PARA GARANTIR LIMPEZA
SELECT pg_sleep(1);

-- 3. CRIAR USUÁRIOS COM UUIDs ÚNICOS
DO $$
DECLARE
    admin_uuid uuid;
    test_uuid uuid;
BEGIN
    -- Gerar UUIDs únicos
    admin_uuid := gen_random_uuid();
    test_uuid := gen_random_uuid();
    
    RAISE NOTICE 'Criando usuários com UUIDs:';
    RAISE NOTICE 'Admin UUID: %', admin_uuid;
    RAISE NOTICE 'Test UUID: %', test_uuid;

    -- Criar usuário admin no auth.users
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
        admin_uuid,
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

    -- Criar perfil público para admin
    INSERT INTO users (
        id,
        email,
        name,
        phone,
        is_admin,
        profile_complete,
        created_at,
        updated_at
    ) VALUES (
        admin_uuid,
        'caio@caio.com',
        'Caio Admin',
        '',
        true,
        true,
        NOW(),
        NOW()
    );

    -- Criar usuário teste no auth.users
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
        test_uuid,
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

    -- Criar perfil público para usuário teste
    INSERT INTO users (
        id,
        email,
        name,
        phone,
        is_admin,
        profile_complete,
        created_at,
        updated_at
    ) VALUES (
        test_uuid,
        'test1@test.com',
        'Test User',
        '',
        false,
        true,
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Usuários criados com sucesso!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao criar usuários: %', SQLERRM;
        RAISE;
END $$;

-- 4. VERIFICAR CRIAÇÃO
SELECT 
    'VERIFICAÇÃO FINAL' as status,
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com')) as auth_users,
    (SELECT COUNT(*) FROM users WHERE email IN ('caio@caio.com', 'test1@test.com')) as public_users;

-- 5. MOSTRAR DETALHES DOS USUÁRIOS CRIADOS
SELECT 
    'DETALHES DOS USUÁRIOS' as info,
    email,
    id,
    'auth.users' as source,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
UNION ALL
SELECT 
    'DETALHES DOS USUÁRIOS' as info,
    email,
    id,
    'public.users' as source,
    is_admin::text as is_admin
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email, source;

-- 6. TESTAR SENHAS
SELECT 
    'TESTE DE SENHAS' as info,
    email,
    CASE 
        WHEN email = 'caio@caio.com' AND encrypted_password = crypt('6464', encrypted_password) THEN '✅ Senha OK'
        WHEN email = 'test1@test.com' AND encrypted_password = crypt('test123', encrypted_password) THEN '✅ Senha OK'
        ELSE '❌ Senha ERRO'
    END as password_status
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 7. CONFIRMAR SINCRONIZAÇÃO DE IDs
SELECT 
    'SINCRONIZAÇÃO DE IDs' as info,
    a.email,
    CASE 
        WHEN a.id = p.id THEN '✅ IDs Sincronizados'
        ELSE '❌ IDs Diferentes'
    END as sync_status,
    a.id as auth_id,
    p.id as public_id
FROM auth.users a
JOIN users p ON a.email = p.email
WHERE a.email IN ('caio@caio.com', 'test1@test.com');
