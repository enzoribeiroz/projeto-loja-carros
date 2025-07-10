-- Corrigir formato de UUID e criar usuários de teste

-- 1. Deletar usuários antigos se existirem
DELETE FROM auth.users WHERE email IN ('test1@test.com', 'caio@caio.com');
DELETE FROM users WHERE email IN ('test1@test.com', 'caio@caio.com');

-- 2. Gerar UUIDs válidos para os usuários
DO $$
DECLARE
    admin_uuid uuid := gen_random_uuid();
    test_uuid uuid := gen_random_uuid();
BEGIN
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

    -- Mostrar os UUIDs criados
    RAISE NOTICE 'Admin UUID: %', admin_uuid;
    RAISE NOTICE 'Test UUID: %', test_uuid;
END $$;

-- 3. Verificar se os usuários foram criados corretamente
SELECT 
    'Usuários criados com sucesso!' as status,
    COUNT(*) as total_auth_users
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

SELECT 
    'Perfis criados com sucesso!' as status,
    COUNT(*) as total_public_users
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 4. Mostrar detalhes dos usuários criados
SELECT 
    email,
    id,
    'auth.users' as source,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
UNION ALL
SELECT 
    email,
    id,
    'public.users' as source,
    is_admin::text as is_admin
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email, source;

-- 5. Confirmar que as senhas estão corretas (teste de hash)
SELECT 
    email,
    CASE 
        WHEN email = 'caio@caio.com' AND encrypted_password = crypt('6464', encrypted_password) THEN 'Senha OK'
        WHEN email = 'test1@test.com' AND encrypted_password = crypt('test123', encrypted_password) THEN 'Senha OK'
        ELSE 'Senha ERRO'
    END as password_status
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');
