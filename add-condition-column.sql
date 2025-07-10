-- Adicionar coluna condition na tabela vehicles se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' 
        AND column_name = 'condition'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.vehicles ADD COLUMN condition TEXT DEFAULT 'Seminovo';
        
        -- Atualizar todos os veículos existentes com valor padrão
        UPDATE public.vehicles SET condition = 'Seminovo' WHERE condition IS NULL;
        
        -- Adicionar comentário
        COMMENT ON COLUMN public.vehicles.condition IS 'Estado do veículo (Novo, Seminovo, Usado, etc.)';
        
        RAISE NOTICE 'Coluna condition adicionada com sucesso à tabela vehicles';
    ELSE
        RAISE NOTICE 'Coluna condition já existe na tabela vehicles';
    END IF;
END $$;

-- Verificar se a coluna foi criada
SELECT 'Verificação da coluna condition' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND column_name = 'condition'
AND table_schema = 'public';

-- Mostrar alguns valores de exemplo
SELECT 'Valores de condition existentes' as info;
SELECT DISTINCT condition, COUNT(*) as quantidade
FROM public.vehicles 
GROUP BY condition
ORDER BY condition; 