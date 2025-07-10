-- CORREÇÃO DO ERRO DE CONSTRAINT DUPLICATE EMAIL
-- Este script resolve conflitos de email duplicado

-- 1. IDENTIFICAR E CORRIGIR DUPLICATAS
DO $$
DECLARE
    duplicate_record RECORD;
BEGIN
    -- Encontrar emails duplicados na tabela public.users
    FOR duplicate_record IN 
        SELECT email, array_agg(id) as ids, count(*) as count
        FROM public.users 
        GROUP BY email 
        HAVING count(*) > 1
    LOOP
        RAISE NOTICE 'Email duplicado encontrado: % (% registros)', duplicate_record.email, duplicate_record.count;
        
        -- Manter apenas o primeiro registro, deletar os outros
        DELETE FROM public.users 
        WHERE email = duplicate_record.email 
        AND id != (duplicate_record.ids)[1];
        
        RAISE NOTICE 'Registros duplicados removidos para: %', duplicate_record.email;
    END LOOP;
END $$;

-- 2. SINCRONIZAR USUÁRIOS ENTRE AUTH E PUBLIC
-- Primeiro, limpar registros órfãos na tabela public (sem correspondente em auth)
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. SINCRONIZAR USUÁRIOS DE AUTH PARA PUBLIC
INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
SELECT 
    a.id,
    a.email,
    COALESCE(a.raw_user_meta_data->>'name', split_part(a.email, '@', 1)),
    COALESCE(a.raw_user_meta_data->>'phone', ''),
    CASE WHEN a.email = 'caio@caio.com' THEN true ELSE false END,
    true
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    name = COALESCE(EXCLUDED.name, public.users.name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();

-- 4. GARANTIR USUÁRIOS DE TESTE ESPECÍFICOS
-- Deletar registros antigos se existirem
DELETE FROM public.users WHERE email IN ('caio@caio.com', 'test1@test.com');

-- Inserir usuários de teste com IDs específicos
INSERT INTO public.users (id, email, name, phone, is_admin, profile_complete)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'caio@caio.com', 'Caio Admin', '', true, true),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'test1@test.com', 'Usuário Teste', '', false, true)
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    name = EXCLUDED.name,
    is_admin = EXCLUDED.is_admin,
    profile_complete = EXCLUDED.profile_complete,
    updated_at = NOW();

-- 5. VERIFICAR RESULTADO
SELECT 'VERIFICAÇÃO FINAL - USUÁRIOS ÚNICOS' as status;

SELECT 
    email,
    id,
    name,
    CASE WHEN is_admin THEN 'ADMIN' ELSE 'USER' END as tipo,
    CASE WHEN profile_complete THEN 'COMPLETO' ELSE 'INCOMPLETO' END as perfil
FROM public.users
ORDER BY is_admin DESC, email;

-- 6. VERIFICAR SE HÁ DUPLICATAS
SELECT 
    'VERIFICAÇÃO DE DUPLICATAS' as check_type,
    email,
    count(*) as quantidade
FROM public.users
GROUP BY email
HAVING count(*) > 1;
