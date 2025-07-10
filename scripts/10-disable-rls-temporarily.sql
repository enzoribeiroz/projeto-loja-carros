-- Desabilitar RLS temporariamente para permitir operações de admin
-- Isso resolve o problema de autenticação para o sistema mock

-- Desabilitar RLS na tabela vehicle_features
ALTER TABLE vehicle_features DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS na tabela vehicle_images  
ALTER TABLE vehicle_images DISABLE ROW LEVEL SECURITY;

-- Manter RLS habilitado apenas na tabela vehicles (principal)
-- ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;

-- Criar políticas mais permissivas para vehicle_features
DROP POLICY IF EXISTS "vehicle_features_select_policy" ON vehicle_features;
DROP POLICY IF EXISTS "vehicle_features_insert_policy" ON vehicle_features;
DROP POLICY IF EXISTS "vehicle_features_update_policy" ON vehicle_features;
DROP POLICY IF EXISTS "vehicle_features_delete_policy" ON vehicle_features;

-- Reabilitar RLS com políticas mais permissivas
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

-- Política permissiva para SELECT (todos podem ver)
CREATE POLICY "vehicle_features_select_policy" ON vehicle_features
    FOR SELECT USING (true);

-- Política permissiva para INSERT (todos podem inserir)
CREATE POLICY "vehicle_features_insert_policy" ON vehicle_features
    FOR INSERT WITH CHECK (true);

-- Política permissiva para UPDATE (todos podem atualizar)
CREATE POLICY "vehicle_features_update_policy" ON vehicle_features
    FOR UPDATE USING (true);

-- Política permissiva para DELETE (todos podem deletar)
CREATE POLICY "vehicle_features_delete_policy" ON vehicle_features
    FOR DELETE USING (true);

-- Fazer o mesmo para vehicle_images
DROP POLICY IF EXISTS "vehicle_images_select_policy" ON vehicle_images;
DROP POLICY IF EXISTS "vehicle_images_insert_policy" ON vehicle_images;
DROP POLICY IF EXISTS "vehicle_images_update_policy" ON vehicle_images;
DROP POLICY IF EXISTS "vehicle_images_delete_policy" ON vehicle_images;

-- Reabilitar RLS com políticas mais permissivas
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para vehicle_images
CREATE POLICY "vehicle_images_select_policy" ON vehicle_images
    FOR SELECT USING (true);

CREATE POLICY "vehicle_images_insert_policy" ON vehicle_images
    FOR INSERT WITH CHECK (true);

CREATE POLICY "vehicle_images_update_policy" ON vehicle_images
    FOR UPDATE USING (true);

CREATE POLICY "vehicle_images_delete_policy" ON vehicle_images
    FOR DELETE USING (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('vehicle_features', 'vehicle_images')
ORDER BY tablename, policyname;
