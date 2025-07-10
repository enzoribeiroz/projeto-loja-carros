-- 🔍 DIAGNÓSTICO COMPLETO DOS VEÍCULOS

-- 1. Verificar se a tabela vehicles existe
SELECT 'Tabela vehicles existe?' as check_type, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles') 
            THEN '✅ SIM' 
            ELSE '❌ NÃO' 
       END as result;

-- 2. Verificar estrutura da tabela
SELECT 'Colunas da tabela vehicles' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;

-- 3. Contar total de veículos
SELECT 'Total de veículos na tabela' as info, COUNT(*) as total FROM vehicles;

-- 4. Verificar veículos ativos vs inativos
SELECT 'Status dos veículos' as info;
SELECT 
  COALESCE(is_active::text, 'NULL') as is_active_status,
  COUNT(*) as quantidade
FROM vehicles 
GROUP BY is_active;

-- 5. Mostrar todos os veículos com detalhes
SELECT 'Todos os veículos' as info;
SELECT 
  id,
  name,
  price,
  year,
  tag,
  is_active,
  created_at
FROM vehicles 
ORDER BY created_at DESC;

-- 6. Verificar se existem imagens
SELECT 'Total de imagens' as info, COUNT(*) as total FROM vehicle_images;

-- 7. Verificar se existem características
SELECT 'Total de características' as info, COUNT(*) as total FROM vehicle_features;

-- 8. Criar veículos de teste se não existirem
DO $$
BEGIN
  -- Só inserir se não houver veículos
  IF (SELECT COUNT(*) FROM vehicles) = 0 THEN
    
    RAISE NOTICE '🚗 Criando veículos de teste...';
    
    -- Inserir veículos de teste
    INSERT INTO vehicles (
      name, price, original_price, year, mileage, fuel, seats, color, 
      transmission, description, tag, location, is_active, created_by
    ) VALUES 
    ('Honda Civic 2024', 'R$ 145.000', 'R$ 155.000', '2024', '0 km', 'Flex', '5 lugares', 'Branco', 
     'Automático', 'Honda Civic 2024 zero quilômetro com tecnologia de ponta', 'NOVO', 'São Paulo, SP', true, 
     (SELECT id FROM auth.users WHERE email = 'caio@caio.com' LIMIT 1)),
     
    ('Toyota Corolla 2022', 'R$ 98.000', NULL, '2022', '25.000 km', 'Flex', '5 lugares', 'Prata', 
     'Automático', 'Toyota Corolla 2022 seminovo em excelente estado', 'SEMINOVO', 'São Paulo, SP', true,
     (SELECT id FROM auth.users WHERE email = 'caio@caio.com' LIMIT 1)),
     
    ('BMW X5 2023', 'R$ 450.000', NULL, '2023', '15.000 km', 'Gasolina', '7 lugares', 'Preto', 
     'Automático', 'BMW X5 2023 premium com todos os opcionais', 'PREMIUM', 'São Paulo, SP', true,
     (SELECT id FROM auth.users WHERE email = 'caio@caio.com' LIMIT 1)),
     
    ('Volkswagen Jetta 2021', 'R$ 85.000', 'R$ 95.000', '2021', '35.000 km', 'Flex', '5 lugares', 'Azul', 
     'Automático', 'Volkswagen Jetta 2021 em oferta especial', 'OFERTA ESPECIAL', 'São Paulo, SP', true,
     (SELECT id FROM auth.users WHERE email = 'caio@caio.com' LIMIT 1)),
     
    ('Chevrolet Onix 2023', 'R$ 75.000', NULL, '2023', '12.000 km', 'Flex', '5 lugares', 'Vermelho', 
     'Manual', 'Chevrolet Onix 2023 econômico e confiável', 'SEMINOVO', 'São Paulo, SP', true,
     (SELECT id FROM auth.users WHERE email = 'caio@caio.com' LIMIT 1));
     
    RAISE NOTICE '✅ 5 veículos de teste criados!';
    
  ELSE
    RAISE NOTICE '✅ Já existem veículos na tabela';
  END IF;
END $$;

-- 9. Verificar resultado final
SELECT 'RESULTADO FINAL' as info;
SELECT 
  'Total de veículos' as tipo,
  COUNT(*) as quantidade
FROM vehicles;

SELECT 
  'Veículos ativos' as tipo,
  COUNT(*) as quantidade
FROM vehicles 
WHERE is_active = true;

-- 10. Mostrar veículos finais
SELECT 'VEÍCULOS DISPONÍVEIS' as info;
SELECT 
  id,
  name,
  price,
  tag,
  is_active,
  created_at
FROM vehicles 
WHERE is_active = true
ORDER BY created_at DESC;
