-- Script para configurar o usuário admin e sincronizar dados

-- 1. Atualizar políticas para o novo admin
UPDATE public.users 
SET is_admin = false 
WHERE email = 'test1@test.com';

-- 2. Garantir que o usuário Caio seja admin quando criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, is_admin, profile_complete)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email = 'caio@caio.com' THEN 'Caio Admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    END,
    NEW.email,
    CASE 
      WHEN NEW.email = 'caio@caio.com' THEN true 
      ELSE false 
    END,
    CASE 
      WHEN NEW.email = 'caio@caio.com' THEN true 
      ELSE false 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atualizar políticas de veículos para permitir apenas o novo admin
DROP POLICY IF EXISTS "Admin users can create vehicles" ON public.vehicles;
CREATE POLICY "Admin users can create vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

DROP POLICY IF EXISTS "Admin can update vehicles" ON public.vehicles;
CREATE POLICY "Admin can update vehicles" ON public.vehicles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

DROP POLICY IF EXISTS "Admin can delete vehicles" ON public.vehicles;
CREATE POLICY "Admin can delete vehicles" ON public.vehicles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

-- 4. Políticas para imagens de veículos
DROP POLICY IF EXISTS "Admin can manage vehicle images" ON public.vehicle_images;
CREATE POLICY "Admin can manage vehicle images" ON public.vehicle_images
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

CREATE POLICY "Anyone can view vehicle images" ON public.vehicle_images
  FOR SELECT USING (true);

-- 5. Políticas para características de veículos
DROP POLICY IF EXISTS "Admin can manage vehicle features" ON public.vehicle_features;
CREATE POLICY "Admin can manage vehicle features" ON public.vehicle_features
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

CREATE POLICY "Anyone can view vehicle features" ON public.vehicle_features
  FOR SELECT USING (true);

-- 6. Políticas para favoritos (usuários logados)
DROP POLICY IF EXISTS "Users can manage their favorites" ON public.favorites;
CREATE POLICY "Users can manage their favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- 7. Políticas para contatos (qualquer um pode criar, admin pode ver)
DROP POLICY IF EXISTS "Anyone can create contacts" ON public.contacts;
CREATE POLICY "Anyone can create contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can view contacts" ON public.contacts;
CREATE POLICY "Admin can view contacts" ON public.contacts
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

-- 8. Função para sincronizar dados do localStorage com Supabase
CREATE OR REPLACE FUNCTION public.sync_vehicle_data()
RETURNS void AS $$
BEGIN
  -- Esta função pode ser chamada para sincronizar dados
  -- Por enquanto, apenas um placeholder
  RAISE NOTICE 'Função de sincronização criada. Use a interface web para migrar dados.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários importantes:
-- 1. Criar usuário no Supabase Auth Dashboard:
--    Email: caio@caio.com
--    Senha: 6464
-- 2. O trigger handle_new_user automaticamente tornará este usuário admin
-- 3. Apenas este usuário poderá criar, editar e deletar veículos
-- 4. O usuário test1@test.com permanece como usuário normal
