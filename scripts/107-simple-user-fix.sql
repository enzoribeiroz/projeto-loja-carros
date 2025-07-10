-- CORREÇÃO SIMPLES E DIRETA DOS USUÁRIOS

-- 1. Limpar tudo primeiro
DELETE FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');
DELETE FROM users WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 2. Aguardar um momento
SELECT pg_sleep(1);

-- 3. Criar usuário admin
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
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

-- 4. Criar usuário teste
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
    'b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
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

-- 5. Criar perfis na tabela public
INSERT INTO users (id, email, name, phone, is_admin, profile_complete, created_at, updated_at)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'caio@caio.com', 'Caio Admin', '', true, true, NOW(), NOW()),
    ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'test1@test.com', 'Test User', '', false, true, NOW(), NOW());

-- 6. Verificar criação
SELECT 'USUÁRIOS CRIADOS:' as status;
SELECT email, id, email_confirmed_at IS NOT NULL as confirmado FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');

SELECT 'PERFIS CRIADOS:' as status;
SELECT email, id, is_admin FROM users WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 7. Testar senhas
SELECT 
    email,
    CASE 
        WHEN email = 'caio@caio.com' AND encrypted_password = crypt('6464', encrypted_password) THEN '✅ Senha 6464 OK'
        WHEN email = 'test1@test.com' AND encrypted_password = crypt('test123', encrypted_password) THEN '✅ Senha test123 OK'
        ELSE '❌ Senha FALHA'
    END as teste_senha
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

SELECT '✅ CONFIGURAÇÃO CONCLUÍDA - TESTE NA APLICAÇÃO!' as final_status;
