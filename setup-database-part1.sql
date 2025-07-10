-- =====================================================
-- PARTE 1: CONFIGURAÇÃO BÁSICA DO BANCO DE DADOS
-- Execute este script primeiro no SQL Editor do Supabase
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

-- 4. INSERIR DADOS INICIAIS
INSERT INTO public.seller_info (name, avatar, rating, phone, whatsapp)
VALUES (
    'AutoMax Concessionária',
    '/placeholder.svg?height=48&width=48',
    4.8,
    '(11) 99999-9999',
    '11999999999'
) ON CONFLICT DO NOTHING;

-- VERIFICAÇÃO
SELECT 'PARTE 1 CONCLUÍDA - TABELAS CRIADAS!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name; 