-- Corrigir usuário de teste e validação de dados

-- 1. Deletar usuário de teste antigo se existir
DELETE FROM auth.users WHERE email = 'test1@test.com';
DELETE FROM users WHERE email = 'test1@test.com';

-- 2. Criar usuário de teste com senha correta
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
    'test-user-id-12345',
    'authenticated',
    'authenticated',
    'test1@test.com',
    crypt('test123', gen_salt('bf')), -- Senha: test123
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

-- 3. Criar perfil público para usuário de teste
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
    'test-user-id-12345',
    'test1@test.com',
    'Test User',
    '',
    false,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    name = EXCLUDED.name,
    is_admin = EXCLUDED.is_admin,
    profile_complete = EXCLUDED.profile_complete,
    updated_at = NOW();

-- 4. Verificar se admin existe e corrigir se necessário
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
    'admin-user-id-caio',
    'caio@caio.com',
    'Caio Admin',
    '',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    name = EXCLUDED.name,
    is_admin = true,
    profile_complete = true,
    updated_at = NOW();

-- 5. Confirmar que admin existe no auth.users
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
    'admin-user-id-caio',
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
) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('6464', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW();

-- 6. Verificar resultados
SELECT 'Usuários criados:' as status;
SELECT email, id, 'auth.users' as source FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com')
UNION ALL
SELECT email, id, 'public.users' as source FROM users WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email, source;
