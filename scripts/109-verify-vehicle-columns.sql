-- Verificar estrutura da tabela vehicles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se existem veículos
SELECT COUNT(*) as total_vehicles FROM vehicles;

-- Mostrar alguns veículos de exemplo
SELECT id, name, brand, model, year, price, is_active, created_at 
FROM vehicles 
LIMIT 5;

-- Verificar se a coluna is_active existe
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'vehicles' 
    AND column_name = 'is_active'
    AND table_schema = 'public'
) as has_is_active_column;
