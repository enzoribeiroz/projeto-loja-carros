-- Script para verificar a estrutura da tabela vehicles
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;

-- 2. Verificar se há veículos na tabela
SELECT 
    id,
    name,
    year,
    price,
    created_at,
    updated_at
FROM vehicles 
LIMIT 5;

-- 3. Verificar se o campo 'year' existe e seu tipo
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND column_name = 'year';

-- 4. Verificar políticas RLS para a tabela vehicles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehicles';

-- 5. Testar uma atualização simples
-- (Descomente as linhas abaixo para testar)
/*
UPDATE vehicles 
SET year = 2024 
WHERE id = (SELECT id FROM vehicles LIMIT 1)
RETURNING id, name, year;
*/

-- 6. Verificar se há constraints que possam estar causando problemas
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'vehicles'::regclass;

-- 7. Verificar se há triggers na tabela
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'vehicles';

-- 8. Verificar permissões do usuário atual
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'vehicles'; 