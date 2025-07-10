-- Corrigir políticas RLS para vehicle_features
DROP POLICY IF EXISTS "Anyone can view vehicle features" ON vehicle_features;
DROP POLICY IF EXISTS "Admins can manage vehicle features" ON vehicle_features;

-- Políticas mais específicas para vehicle_features
CREATE POLICY "Anyone can view vehicle features" ON vehicle_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_features.vehicle_id 
            AND vehicles.is_active = true
        )
    );

CREATE POLICY "Admins can view all vehicle features" ON vehicle_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can insert vehicle features" ON vehicle_features
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update vehicle features" ON vehicle_features
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can delete vehicle features" ON vehicle_features
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Corrigir políticas para vehicle_images também
DROP POLICY IF EXISTS "Anyone can view vehicle images" ON vehicle_images;
DROP POLICY IF EXISTS "Admins can manage vehicle images" ON vehicle_images;

CREATE POLICY "Anyone can view vehicle images" ON vehicle_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_images.vehicle_id 
            AND vehicles.is_active = true
        )
    );

CREATE POLICY "Admins can view all vehicle images" ON vehicle_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can insert vehicle images" ON vehicle_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update vehicle images" ON vehicle_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can delete vehicle images" ON vehicle_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Verificar se o usuário admin existe e tem as permissões corretas
UPDATE users SET is_admin = true WHERE email = 'caio@caio.com';

-- Inserir usuário admin se não existir
INSERT INTO users (id, email, full_name, is_admin, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'caio@caio.com',
    'Caio Admin',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    is_admin = true,
    updated_at = now();
