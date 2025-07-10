-- =====================================================
-- PARTE 3 SEGURA: FUNÇÕES E TRIGGERS (SEM CONFLITOS)
-- Execute este script mesmo se as funções já existirem
-- =====================================================

-- 1. CRIAR FUNÇÕES E TRIGGERS (usando CREATE OR REPLACE)

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at (usando DROP TRIGGER IF EXISTS)
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

-- 2. HABILITAR REALTIME PARA TODAS AS TABELAS (seguro)
-- Nota: Se a tabela já estiver na publicação, não dará erro
DO $$
BEGIN
    -- Adicionar tabelas à publicação supabase_realtime se não estiverem
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'users') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'vehicles') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'vehicle_images') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_images;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'vehicle_features') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_features;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'favorites') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.favorites;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'contacts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'seller_info') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.seller_info;
    END IF;
END $$;

-- VERIFICAÇÃO
SELECT 'PARTE 3 SEGURA CONCLUÍDA - FUNÇÕES E TRIGGERS CRIADOS!' as status;
SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_schema = 'public' ORDER BY routine_name; 