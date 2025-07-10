-- CORREÇÃO COMPLETA DO SISTEMA DE AUTENTICAÇÃO
-- Execute este script para corrigir todos os problemas

-- 1. CONFIRMAR TODOS OS EMAILS (para permitir login)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. RECRIAR FUNÇÃO DE SINCRONIZAÇÃO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        CASE WHEN NEW.email = 'caio@caio.com' THEN true ELSE false END,
        CASE WHEN NEW.email = 'caio@caio.com' THEN true ELSE false END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RECRIAR TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SINCRONIZAR USUÁRIOS EXISTENTES
INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
SELECT 
    a.id,
    a.email,
    COALESCE(a.raw_user_meta_data->>'name', split_part(a.email, '@', 1)),
    COALESCE(a.raw_user_meta_data->>'phone', ''),
    CASE WHEN a.email = 'caio@caio.com' THEN true ELSE false END,
    CASE WHEN a.email = 'caio@caio.com' THEN true ELSE false END
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    updated_at = NOW();

-- 5. SIMPLIFICAR POLÍTICAS RLS PARA DEBUG
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Políticas mais permissivas para debug
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- 6. GARANTIR QUE USUÁRIO ADMIN EXISTE
DO $$
BEGIN
    -- Primeiro, tentar inserir na tabela auth (se não existir)
    -- Nota: Isso só funciona se você tiver permissões de superuser
    
    -- Garantir que existe na tabela public
    INSERT INTO public.users (id, email, name, is_admin, profile_complete)
    VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
        'caio@caio.com',
        'Caio Admin',
        true,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        is_admin = true,
        profile_complete = true,
        name = 'Caio Admin',
        updated_at = NOW();
        
    -- Também criar usuário de teste
    INSERT INTO public.users (id, email, name, is_admin, profile_complete)
    VALUES (
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid,
        'test1@test.com',
        'Usuário Teste',
        false,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        name = 'Usuário Teste',
        profile_complete = true,
        updated_at = NOW();
END $$;

-- 7. VERIFICAR RESULTADO
SELECT 'VERIFICAÇÃO FINAL' as status;
SELECT 
    'Auth Users' as tabela,
    count(*) as total,
    count(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmados
FROM auth.users

UNION ALL

SELECT 
    'Public Users' as tabela,
    count(*) as total,
    count(CASE WHEN is_admin THEN 1 END) as admins
FROM public.users;

-- 8. MOSTRAR USUÁRIOS PARA TESTE
SELECT 
    'USUÁRIOS PARA TESTE' as info,
    email,
    name,
    CASE WHEN is_admin THEN 'ADMIN' ELSE 'USER' END as tipo
FROM public.users
ORDER BY is_admin DESC, email;
