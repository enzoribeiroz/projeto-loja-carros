-- =====================================================
-- PARTE 2 SEGURA: CONFIGURAÇÃO DE SEGURANÇA (SEM CONFLITOS)
-- Execute este script mesmo se as políticas já existirem
-- =====================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) - seguro
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_info ENABLE ROW LEVEL SECURITY;

-- 2. CRIAR POLÍTICAS RLS (usando DROP POLICY IF EXISTS)

-- Políticas para users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para vehicles (todos podem ver, apenas admins podem modificar)
DROP POLICY IF EXISTS "Anyone can view active vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view active vehicles" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Admins can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
CREATE POLICY "Admins can update vehicles" ON public.vehicles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins can delete vehicles" ON public.vehicles FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para vehicle_images
DROP POLICY IF EXISTS "Anyone can view vehicle images" ON public.vehicle_images;
CREATE POLICY "Anyone can view vehicle images" ON public.vehicle_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage vehicle images" ON public.vehicle_images;
CREATE POLICY "Admins can manage vehicle images" ON public.vehicle_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para vehicle_features
DROP POLICY IF EXISTS "Anyone can view vehicle features" ON public.vehicle_features;
CREATE POLICY "Anyone can view vehicle features" ON public.vehicle_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage vehicle features" ON public.vehicle_features;
CREATE POLICY "Admins can manage vehicle features" ON public.vehicle_features FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Políticas para contacts
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
CREATE POLICY "Anyone can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;
CREATE POLICY "Admins can view contacts" ON public.contacts FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Políticas para seller_info
DROP POLICY IF EXISTS "Anyone can view seller info" ON public.seller_info;
CREATE POLICY "Anyone can view seller info" ON public.seller_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage seller info" ON public.seller_info;
CREATE POLICY "Admins can manage seller info" ON public.seller_info FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- VERIFICAÇÃO
SELECT 'PARTE 2 SEGURA CONCLUÍDA - SEGURANÇA CONFIGURADA!' as status;
SELECT schemaname, tablename, rowsecurity as rls_enabled FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename; 