-- LIMPEZA NUCLEAR - REMOVE TUDO E RECRIA DO ZERO

-- 1. Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas RLS
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- 3. Remover triggers que podem interferir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. TRUNCATE força a limpeza completa (mais agressivo que DELETE)
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- 5. Limpar auth.users manualmente
DELETE FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 6. Aguardar para garantir limpeza
SELECT pg_sleep(2);

-- 7. Verificar se está limpo
SELECT 'VERIFICANDO LIMPEZA:' as status;
SELECT COUNT(*) as auth_users FROM auth.users WHERE email IN ('caio@caio.com', 'test1@test.com');
SELECT COUNT(*) as public_users FROM users WHERE email IN ('caio@caio.com', 'test1@test.com');

-- 8. Criar usuários do zero com UUIDs únicos
DO $$
DECLARE
    admin_uuid uuid := gen_random_uuid();
    user_uuid uuid := gen_random_uuid();
BEGIN
    -- Mostrar UUIDs que serão usados
    RAISE NOTICE 'Admin UUID: %', admin_uuid;
    RAISE NOTICE 'User UUID: %', user_uuid;
    
    -- Criar admin no auth
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
    
    -- Criar user no auth
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
        user_uuid,
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
    
    -- Criar perfis no public
    INSERT INTO users (id, email, name, phone, is_admin, profile_complete, created_at, updated_at)
    VALUES 
        (admin_uuid, 'caio@caio.com', 'Caio Admin', '', true, true, NOW(), NOW()),
        (user_uuid, 'test1@test.com', 'Test User', '', false, true, NOW(), NOW());
        
    RAISE NOTICE 'Usuários criados com sucesso!';
END $$;

-- 9. Recriar função de trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE WHEN new.email = 'caio@caio.com' THEN true ELSE false END,
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Recriar políticas RLS
CREATE POLICY "Allow authenticated users to read profiles" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- 12. Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 13. Verificação final
SELECT '=== VERIFICAÇÃO FINAL ===' as status;

SELECT 'AUTH USERS:' as tabela;
SELECT email, id, email_confirmed_at IS NOT NULL as confirmado 
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

SELECT 'PUBLIC USERS:' as tabela;
SELECT email, id, is_admin 
FROM users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

-- 14. Teste de senhas
SELECT 'TESTE DE SENHAS:' as status;
SELECT 
    email,
    CASE 
        WHEN email = 'caio@caio.com' AND encrypted_password = crypt('6464', encrypted_password) THEN '✅ Admin senha OK'
        WHEN email = 'test1@test.com' AND encrypted_password = crypt('test123', encrypted_password) THEN '✅ User senha OK'
        ELSE '❌ Senha FALHA'
    END as resultado
FROM auth.users 
WHERE email IN ('caio@caio.com', 'test1@test.com')
ORDER BY email;

SELECT '🎉 CONFIGURAÇÃO NUCLEAR CONCLUÍDA!' as final_status;
SELECT 'Credenciais: caio@caio.com/6464 e test1@test.com/test123' as credenciais;
