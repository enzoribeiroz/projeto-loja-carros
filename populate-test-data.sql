-- =====================================================
-- POPULAR DADOS DE TESTE NO SUPABASE
-- Execute este script após o setup-complete-database.sql
-- =====================================================

-- 1. INSERIR VEÍCULOS DE TESTE

-- Limpar dados existentes (opcional)
DELETE FROM public.vehicle_features;
DELETE FROM public.vehicle_images;
DELETE FROM public.vehicles;

-- Inserir veículos de teste
INSERT INTO public.vehicles (id, name, brand, model, year, price, original_price, mileage, fuel, transmission, color, seats, description, tag, category, location, is_active) VALUES
-- NOVOS
('550e8400-e29b-41d4-a716-446655440001', 'Honda Civic 2023', 'Honda', 'Civic', 2023, 125000.00, NULL, 0, 'Flex', 'Automático', 'Branco Pérola', 5, 'Honda Civic 2023 zero quilômetro, representando o que há de mais moderno em tecnologia automotiva.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440002', 'Toyota Corolla 2022', 'Toyota', 'Corolla', 2022, 115000.00, NULL, 15000, 'Flex', 'CVT', 'Prata Metallic', 5, 'Toyota Corolla 2022 seminovo em estado impecável, com apenas 15.000 km rodados.', 'SEMINOVO', 'seminovos', 'Rio de Janeiro, RJ', true),
('550e8400-e29b-41d4-a716-446655440003', 'BMW X3 2021', 'BMW', 'X3', 2021, 280000.00, NULL, 25000, 'Gasolina', 'Automático', 'Preto Sapphire', 5, 'BMW X3 2021 premium em estado excepcional, único dono executivo.', 'PREMIUM', 'premium', 'Belo Horizonte, MG', true),
('550e8400-e29b-41d4-a716-446655440004', 'Volkswagen Polo 2022', 'Volkswagen', 'Polo', 2022, 78000.00, 85000.00, 35000, 'Flex', 'Manual', 'Azul Silk', 5, 'Volkswagen Polo 2022 em oferta especial! Hatch premium com design europeu.', 'OFERTA ESPECIAL', 'ofertas', 'Curitiba, PR', true),
('550e8400-e29b-41d4-a716-446655440005', 'Hyundai HB20 2023', 'Hyundai', 'HB20', 2023, 75000.00, NULL, 0, 'Flex', 'Manual', 'Azul Ocean', 5, 'Hyundai HB20 2023 zero quilômetro, o hatch compacto mais vendido do Brasil.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440006', 'Jeep Compass 2023', 'Jeep', 'Compass', 2023, 145000.00, NULL, 0, 'Flex', 'Automático', 'Preto Carbon', 5, 'Jeep Compass 2023 zero quilômetro, o SUV que combina robustez e sofisticação.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440007', 'Toyota Hilux 2023', 'Toyota', 'Hilux', 2023, 185000.00, NULL, 0, 'Diesel', 'Automático', 'Branco Polar', 5, 'Toyota Hilux 2023 zero quilômetro, a picape mais confiável do mercado brasileiro.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440008', 'Volkswagen T-Cross 2023', 'Volkswagen', 'T-Cross', 2023, 95000.00, NULL, 0, 'Flex', 'Automático', 'Cinza Platinum', 5, 'Volkswagen T-Cross 2023 zero quilômetro, o SUV compacto que redefine versatilidade urbana.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440009', 'Renault Kwid 2023', 'Renault', 'Kwid', 2023, 55000.00, NULL, 0, 'Flex', 'Manual', 'Laranja Sunset', 5, 'Renault Kwid 2023 zero quilômetro, o carro ideal para quem busca economia e praticidade.', 'NOVO', 'novos', 'São Paulo, SP', true),
('550e8400-e29b-41d4-a716-446655440010', 'BMW 320i 2023', 'BMW', '320i', 2023, 245000.00, NULL, 0, 'Gasolina', 'Automático', 'Azul Storm Bay', 5, 'BMW 320i 2023 zero quilômetro, o sedan premium que define luxo e performance.', 'NOVO', 'novos', 'São Paulo, SP', true);

-- 2. INSERIR IMAGENS PARA OS VEÍCULOS
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440006', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440007', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440008', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440009', '/placeholder.svg?height=400&width=600', true, 1),
('550e8400-e29b-41d4-a716-446655440010', '/placeholder.svg?height=400&width=600', true, 1);

-- 3. INSERIR CARACTERÍSTICAS PARA OS VEÍCULOS
INSERT INTO public.vehicle_features (vehicle_id, feature) VALUES
-- Honda Civic 2023
('550e8400-e29b-41d4-a716-446655440001', 'Motor 2.0 i-VTEC Flex'),
('550e8400-e29b-41d4-a716-446655440001', 'Transmissão CVT'),
('550e8400-e29b-41d4-a716-446655440001', 'Ar condicionado digital dual zone'),
('550e8400-e29b-41d4-a716-446655440001', 'Central multimídia 9 polegadas'),
('550e8400-e29b-41d4-a716-446655440001', 'Bancos em couro premium'),
('550e8400-e29b-41d4-a716-446655440001', 'Sistema Honda SENSING'),

-- Toyota Corolla 2022
('550e8400-e29b-41d4-a716-446655440002', 'Motor 2.0 Dynamic Force Flex'),
('550e8400-e29b-41d4-a716-446655440002', 'Transmissão CVT'),
('550e8400-e29b-41d4-a716-446655440002', 'Toyota Safety Sense'),
('550e8400-e29b-41d4-a716-446655440002', 'Ar condicionado automático'),
('550e8400-e29b-41d4-a716-446655440002', 'Central multimídia Toyota'),
('550e8400-e29b-41d4-a716-446655440002', 'Faróis LED'),

-- BMW X3 2021
('550e8400-e29b-41d4-a716-446655440003', 'Motor 2.0 TwinPower Turbo'),
('550e8400-e29b-41d4-a716-446655440003', 'Tração xDrive integral'),
('550e8400-e29b-41d4-a716-446655440003', 'Sistema iDrive 7.0'),
('550e8400-e29b-41d4-a716-446655440003', 'Bancos em couro Dakota'),
('550e8400-e29b-41d4-a716-446655440003', 'Teto solar panorâmico'),
('550e8400-e29b-41d4-a716-446655440003', 'Sistema de som Harman Kardon'),

-- Volkswagen Polo 2022
('550e8400-e29b-41d4-a716-446655440004', 'Motor 1.0 TSI'),
('550e8400-e29b-41d4-a716-446655440004', 'Transmissão manual 6 velocidades'),
('550e8400-e29b-41d4-a716-446655440004', 'Ar condicionado'),
('550e8400-e29b-41d4-a716-446655440004', 'Direção elétrica'),
('550e8400-e29b-41d4-a716-446655440004', 'Vidros elétricos'),
('550e8400-e29b-41d4-a716-446655440004', 'Freios ABS'),

-- Hyundai HB20 2023
('550e8400-e29b-41d4-a716-446655440005', 'Motor 1.0 Flex'),
('550e8400-e29b-41d4-a716-446655440005', 'Transmissão manual 5 velocidades'),
('550e8400-e29b-41d4-a716-446655440005', 'Ar condicionado'),
('550e8400-e29b-41d4-a716-446655440005', 'Direção elétrica'),
('550e8400-e29b-41d4-a716-446655440005', 'Vidros elétricos'),
('550e8400-e29b-41d4-a716-446655440005', 'Freios ABS'),

-- Jeep Compass 2023
('550e8400-e29b-41d4-a716-446655440006', 'Motor Turbo Flex'),
('550e8400-e29b-41d4-a716-446655440006', 'Transmissão automática 6 velocidades'),
('550e8400-e29b-41d4-a716-446655440006', 'Tração 4x4'),
('550e8400-e29b-41d4-a716-446655440006', 'Ar condicionado dual zone'),
('550e8400-e29b-41d4-a716-446655440006', 'Central multimídia 8.4"'),
('550e8400-e29b-41d4-a716-446655440006', 'Sistema de som premium'),

-- Toyota Hilux 2023
('550e8400-e29b-41d4-a716-446655440007', 'Motor 2.8 Diesel Turbo'),
('550e8400-e29b-41d4-a716-446655440007', 'Transmissão automática 6 velocidades'),
('550e8400-e29b-41d4-a716-446655440007', 'Tração 4x4'),
('550e8400-e29b-41d4-a716-446655440007', 'Ar condicionado'),
('550e8400-e29b-41d4-a716-446655440007', 'Central multimídia'),
('550e8400-e29b-41d4-a716-446655440007', 'Sistema de segurança Toyota'),

-- Volkswagen T-Cross 2023
('550e8400-e29b-41d4-a716-446655440008', 'Motor 1.0 TSI'),
('550e8400-e29b-41d4-a716-446655440008', 'Transmissão automática 6 velocidades'),
('550e8400-e29b-41d4-a716-446655440008', 'Ar condicionado'),
('550e8400-e29b-41d4-a716-446655440008', 'Central multimídia'),
('550e8400-e29b-41d4-a716-446655440008', 'Sistema de som'),
('550e8400-e29b-41d4-a716-446655440008', 'Freios ABS'),

-- Renault Kwid 2023
('550e8400-e29b-41d4-a716-446655440009', 'Motor 1.0 Flex'),
('550e8400-e29b-41d4-a716-446655440009', 'Transmissão manual 5 velocidades'),
('550e8400-e29b-41d4-a716-446655440009', 'Ar condicionado'),
('550e8400-e29b-41d4-a716-446655440009', 'Direção elétrica'),
('550e8400-e29b-41d4-a716-446655440009', 'Vidros elétricos'),
('550e8400-e29b-41d4-a716-446655440009', 'Freios ABS'),

-- BMW 320i 2023
('550e8400-e29b-41d4-a716-446655440010', 'Motor 2.0 TwinPower Turbo'),
('550e8400-e29b-41d4-a716-446655440010', 'Transmissão automática 8 velocidades'),
('550e8400-e29b-41d4-a716-446655440010', 'Tração traseira'),
('550e8400-e29b-41d4-a716-446655440010', 'Sistema iDrive 7.0'),
('550e8400-e29b-41d4-a716-446655440010', 'Bancos em couro Dakota'),
('550e8400-e29b-41d4-a716-446655440010', 'Sistema de som Harman Kardon');

-- 4. VERIFICAÇÃO FINAL
SELECT 'DADOS DE TESTE INSERIDOS COM SUCESSO!' as status;
SELECT 'Veículos inseridos:' as info;
SELECT COUNT(*) as total_vehicles FROM public.vehicles;
SELECT 'Imagens inseridas:' as info;
SELECT COUNT(*) as total_images FROM public.vehicle_images;
SELECT 'Características inseridas:' as info;
SELECT COUNT(*) as total_features FROM public.vehicle_features; 