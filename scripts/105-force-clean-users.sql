-- LIMPEZA FORÇADA E RECRIAÇÃO COMPLETA DE USUÁRIOS

-- 1. DESABILITAR TEMPORARIAMENTE RLS E TRIGGERS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. LIMPEZA FORÇADA COM TRUNCATE (mais agressivo que DELETE)
DO $$
BEGIN
    -- Truncar tabela users (remove todos os dados e reseta sequences)
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    RAISE NOTICE '✅ Tabela users limpa com TRUNCATE';
    
    -- Tentar limpar auth.users (pode falhar, mas não importa)
    BEGIN
        DELETE FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');
        RAISE NOTICE '✅ Usuários removidos de auth.users';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️ Não foi possível limpar auth.users: %', SQLERRM;
    END;
    
END $$;

-- 3. AGUARDAR PARA GARANTIR LIMPEZA
SELECT pg_sleep(2);

-- 4. REABILITAR RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR USUÁRIOS COM MÉTODO MAIS SEGURO
DO $$
DECLARE
    admin_uuid uuid;
    test_uuid uuid;
    admin_exists boolean := false;
    test_exists boolean := false;
BEGIN
    -- Gerar UUIDs únicos
    admin_uuid := gen_random_uuid();
    test_uuid := gen_random_uuid();
    
    RAISE NOTICE '🔧 Criando usuários com UUIDs únicos:';
    RAISE NOTICE 'Admin UUID: %', admin_uuid;
    RAISE NOTICE 'Test UUID: %', test_uuid;

    -- Verificar se já existem na tabela auth
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'caio@caio.com') INTO admin_exists;
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'test1@test.com') INTO test_exists;
    
    -- Criar admin apenas se não existir
    IF NOT admin_exists THEN
        BEGIN
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
            RAISE NOTICE '✅ Admin criado em auth.users';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Erro ao criar admin em auth.users: %', SQLERRM;
        END;
    ELSE
        -- Se já existe, pegar o UUID existente
        SELECT id INTO admin_uuid FROM auth.users WHERE email = 'caio@caio.com';
        RAISE NOTICE '⚠️ Admin já existe em auth.users com UUID: %', admin_uuid;
    END IF;

    -- Criar usuário teste apenas se não existir
    IF NOT test_exists THEN
        BEGIN
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
            RAISE NOTICE '✅ Test user criado em auth.users';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️ Erro ao criar test user em auth.users: %', SQLERRM;
        END;
    ELSE
        -- Se já existe, pegar o UUID existente
        SELECT id INTO test_uuid FROM auth.users WHERE email = 'test1@test.com';
        RAISE NOTICE '⚠️ Test user já existe em auth.users com UUID: %', test_uuid;
    END IF;

    -- Criar perfis públicos (tabela já foi limpa com TRUNCATE)
    BEGIN
        INSERT INTO users (
            id,
            email,
            name,
            phone,
            is_admin,
            profile_complete,
            created_at,
            updated_at
        ) VALUES 
        (
            admin_uuid,
            'caio@caio.com',
            'Caio Admin',
            '',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            test_uuid,
            'test1@test.com',
            'Test User',
            '',
            false,
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Perfis públicos criados com sucesso!';
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Erro ao criar perfis públicos: %', SQLERRM;
            RAISE;
    END;

END $$;

-- 6. RECRIAR TRIGGER DE SINCRONIZAÇÃO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email = 'caio@caio.com',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. VERIFICAÇÕES FINAIS
SELECT 
    '=== VERIFICAÇÃO FINAL ===' as status;

-- Contar usuários
SELECT 
    'CONTAGEM' as tipo,
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com')) as auth_count,
    (SELECT COUNT(*) FROM users WHERE email IN ('caio@caio.com', 'test1@test.com')) as public_count;

-- Mostrar detalhes
SELECT 
    'DETALHES' as tipo,
    email,
    id,
    'auth.users' as tabela,
    email_confirmed_at IS NOT NULL as confirmado
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
UNION ALL
SELECT 
    'DETALHES' as tipo,
    email,
    id,
    'public.users' as tabela,
    is_admin::text as admin
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email, tabela;

-- Verificar sincronização
SELECT 
    'SINCRONIZAÇÃO' as tipo,
    a.email,
    CASE 
        WHEN a.id = p.id THEN '✅ IDs Iguais'
        ELSE '❌ IDs Diferentes'
    END as status,
    a.id as auth_id,
    p.id as public_id
FROM auth.users a
FULL OUTER JOIN users p ON a.email = p.email
WHERE a.email IN ('caio@caio.com', 'test1@test.com') 
   OR p.email IN ('caio@caio.com', 'test1@test.com');

-- Testar senhas
SELECT 
    'TESTE SENHAS' as tipo,
    email,
    CASE 
        WHEN email = 'caio@caio.com' AND encrypted_password = crypt('6464', encrypted_password) THEN '✅ Senha 6464 OK'
        WHEN email = 'test1@test.com' AND encrypted_password = crypt('test123', encrypted_password) THEN '✅ Senha test123 OK'
        ELSE '❌ Senha ERRO'
    END as senha_status
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com');

SELECT '=== PROCESSO CONCLUÍDO ===' as final_status;
