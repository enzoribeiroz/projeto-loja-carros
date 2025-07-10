-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS SUPABASE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. HABILITAR EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CRIAR TABELAS PRINCIPAIS

-- Tabela de usuários (sincronizada com auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de informações do vendedor
CREATE TABLE IF NOT EXISTS public.seller_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'AutoMax Concessionária',
    avatar TEXT DEFAULT '/placeholder.svg?height=48&width=48',
    rating DECIMAL(2,1) DEFAULT 4.8,
    phone TEXT DEFAULT '(11) 99999-9999',
    whatsapp TEXT DEFAULT '11999999999',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    mileage INTEGER DEFAULT 0,
    fuel TEXT NOT NULL,
    transmission TEXT NOT NULL,
    color TEXT NOT NULL,
    seats INTEGER DEFAULT 5,
    doors INTEGER DEFAULT 4,
    engine TEXT,
    fuel_consumption TEXT,
    warranty TEXT,
    condition TEXT DEFAULT 'Seminovo',
    description TEXT,
    tag TEXT DEFAULT 'DISPONÍVEL',
    category TEXT DEFAULT 'seminovos',
    location TEXT DEFAULT 'São Paulo, SP',
    is_active BOOLEAN DEFAULT TRUE,
    seller_id UUID REFERENCES public.seller_info(id) DEFAULT NULL,
    created_by UUID REFERENCES public.users(id) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens dos veículos
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de características dos veículos
CREATE TABLE IF NOT EXISTS public.vehicle_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    feature TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON public.vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_tag ON public.vehicles(tag);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_features_vehicle_id ON public.vehicle_features(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vehicle_id ON public.favorites(vehicle_id);

-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_info ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICAS RLS

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

-- 6. CRIAR FUNÇÕES E TRIGGERS

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.vehicles;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.seller_info;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.seller_info
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, is_admin)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. INSERIR DADOS INICIAIS

-- Inserir informações do vendedor
INSERT INTO public.seller_info (name, avatar, rating, phone, whatsapp)
VALUES (
    'AutoMax Concessionária',
    '/placeholder.svg?height=48&width=48',
    4.8,
    '(11) 99999-9999',
    '11999999999'
) ON CONFLICT DO NOTHING;

-- 8. HABILITAR REALTIME PARA TODAS AS TABELAS
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_features;
ALTER PUBLICATION supabase_realtime ADD TABLE public.favorites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_info;

-- 9. VERIFICAÇÃO FINAL
SELECT 'CONFIGURAÇÃO COMPLETA!' as status;
SELECT 'Tabelas criadas:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name; 