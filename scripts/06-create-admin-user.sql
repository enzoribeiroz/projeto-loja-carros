-- Criar o usuário admin Caio no Supabase Auth
-- Este script deve ser executado após configurar o Supabase

-- Primeiro, vamos atualizar a função de criação de usuários para incluir o novo admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, is_admin, profile_complete)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 
      CASE 
        WHEN NEW.email = 'caio@caio.com' THEN 'Caio Admin'
        ELSE split_part(NEW.email, '@', 1)
      END
    ),
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

-- Atualizar usuários existentes para remover admin do test1@test.com
UPDATE public.users 
SET is_admin = false 
WHERE email = 'test1@test.com';

-- Se o usuário Caio já existir, torná-lo admin
UPDATE public.users 
SET is_admin = true, 
    full_name = 'Caio Admin',
    profile_complete = true
WHERE email = 'caio@caio.com';

-- Se não existir, inserir o usuário Caio (será criado automaticamente quando ele fizer login)
-- O trigger handle_new_user cuidará da criação automática

-- Atualizar a política de criação de veículos para permitir apenas o novo admin
DROP POLICY IF EXISTS "Users can create vehicles if admin" ON public.vehicles;

CREATE POLICY "Admin users can create vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

-- Política para visualizar veículos (todos podem ver)
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

-- Política para atualizar veículos (apenas admin)
DROP POLICY IF EXISTS "Admin can update vehicles" ON public.vehicles;
CREATE POLICY "Admin can update vehicles" ON public.vehicles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

-- Política para deletar veículos (apenas admin)
DROP POLICY IF EXISTS "Admin can delete vehicles" ON public.vehicles;
CREATE POLICY "Admin can delete vehicles" ON public.vehicles
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE is_admin = true AND email = 'caio@caio.com'
    )
  );

-- Comentário para lembrar de criar o usuário no Supabase Auth Dashboard
-- Email: caio@caio.com
-- Senha: 6464
-- Ou usar a função de signup no código
