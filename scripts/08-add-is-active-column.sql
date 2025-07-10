-- Adicionar coluna is_active na tabela vehicles se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        -- Atualizar todos os veículos existentes para ativo
        UPDATE vehicles SET is_active = true WHERE is_active IS NULL;
        
        -- Adicionar comentário
        COMMENT ON COLUMN vehicles.is_active IS 'Indica se o veículo está ativo/visível no site';
        
        RAISE NOTICE 'Coluna is_active adicionada com sucesso à tabela vehicles';
    ELSE
        RAISE NOTICE 'Coluna is_active já existe na tabela vehicles';
    END IF;
END $$;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON vehicles(is_active);
