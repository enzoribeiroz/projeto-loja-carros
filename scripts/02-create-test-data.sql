-- SCRIPT PARA CRIAR DADOS DE TESTE
-- Execute após a configuração inicial

-- Limpar dados existentes (cuidado em produção!)
DELETE FROM public.vehicle_features;
DELETE FROM public.vehicle_images;
DELETE FROM public.favorites;
DELETE FROM public.vehicles;

-- Inserir veículos de teste
INSERT INTO public.vehicles (
    name, brand, model, year, price, original_price, mileage, fuel, transmission, color, seats, doors,
    description, tag, category, location, is_active
) VALUES 
-- Veículos Novos
('Honda Civic Touring 2024', 'Honda', 'Civic', 2024, 145000.00, NULL, 0, 'Flex', 'CVT', 'Branco Pérola', 5, 4,
 'Sedan premium com tecnologia Honda SENSING, interior em couro e sistema multimídia avançado.', 'NOVO', 'novos', 'São Paulo, SP', true),

('Toyota Corolla Altis 2024', 'Toyota', 'Corolla', 2024, 135000.00, NULL, 0, 'Flex', 'CVT', 'Prata Metálico', 5, 4,
 'Sedan executivo com Toyota Safety Sense 2.0, bancos em couro e ar condicionado digital.', 'NOVO', 'novos', 'São Paulo, SP', true),

('Hyundai HB20S Diamond 2024', 'Hyundai', 'HB20S', 2024, 85000.00, NULL, 0, 'Flex', 'Automático', 'Azul Oceano', 5, 4,
 'Sedan compacto com design moderno, central multimídia e excelente custo-benefício.', 'NOVO', 'novos', 'São Paulo, SP', true),

-- Veículos Seminovos
('BMW 320i Sport 2022', 'BMW', '320i', 2022, 185000.00, NULL, 25000, 'Gasolina', 'Automático', 'Preto Safira', 5, 4,
 'Sedan esportivo alemão com motor turbo, interior premium e tecnologia BMW ConnectedDrive.', 'SEMINOVO', 'seminovos', 'São Paulo, SP', true),

('Audi A4 Prestige 2021', 'Audi', 'A4', 2021, 165000.00, NULL, 35000, 'Gasolina', 'S-Tronic', 'Cinza Daytona', 5, 4,
 'Sedan executivo com quattro, virtual cockpit e acabamento em couro Valcona.', 'SEMINOVO', 'seminovos', 'São Paulo, SP', true),

('Mercedes C200 Avantgarde 2020', 'Mercedes-Benz', 'C200', 2020, 155000.00, NULL, 42000, 'Gasolina', 'Automático', 'Branco Polar', 5, 4,
 'Sedan de luxo alemão com MBUX, teto solar e sistema de som Burmester.', 'SEMINOVO', 'seminovos', 'São Paulo, SP', true),

-- Veículos Premium
('Porsche Macan S 2023', 'Porsche', 'Macan', 2023, 450000.00, NULL, 8000, 'Gasolina', 'PDK', 'Vermelho Carmin', 5, 5,
 'SUV esportivo com motor V6 turbo, suspensão pneumática e interior em couro Alcantara.', 'PREMIUM', 'premium', 'São Paulo, SP', true),

('BMW X5 xDrive40i 2022', 'BMW', 'X5', 2022, 420000.00, NULL, 15000, 'Gasolina', 'Automático', 'Azul Phytonic', 7, 5,
 'SUV premium com tração integral, terceira fileira e pacote M Sport.', 'PREMIUM', 'premium', 'São Paulo, SP', true),

('Range Rover Evoque 2021', 'Land Rover', 'Evoque', 2021, 280000.00, NULL, 28000, 'Gasolina', 'Automático', 'Preto Santorini', 5, 5,
 'SUV de luxo britânico com design icônico, teto panorâmico e sistema Terrain Response.', 'PREMIUM', 'premium', 'São Paulo, SP', true),

-- Ofertas Especiais
('Volkswagen Jetta Comfortline 2019', 'Volkswagen', 'Jetta', 2019, 75000.00, 85000.00, 55000, 'Flex', 'Automático', 'Prata Tungstênio', 5, 4,
 'Sedan alemão com motor TSI, câmbio Tiptronic e central multimídia com Android Auto.', 'OFERTA ESPECIAL', 'ofertas', 'São Paulo, SP', true),

('Nissan Sentra SV 2020', 'Nissan', 'Sentra', 2020, 68000.00, 78000.00, 48000, 'Flex', 'CVT', 'Vermelho Metálico', 5, 4,
 'Sedan japonês com design renovado, sistema Nissan Connect e câmera de ré.', 'OFERTA ESPECIAL', 'ofertas', 'São Paulo, SP', true),

('Chevrolet Cruze LTZ 2018', 'Chevrolet', 'Cruze', 2018, 62000.00, 72000.00, 65000, 'Flex', 'Automático', 'Branco Summit', 5, 4,
 'Sedan americano com motor turbo, MyLink e acabamento premium em couro.', 'OFERTA ESPECIAL', 'ofertas', 'São Paulo, SP', true);

-- Inserir imagens para todos os veículos
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary, display_order)
SELECT 
    v.id,
    '/placeholder.svg?height=400&width=600&text=' || encode(v.name::bytea, 'base64'),
    true,
    0
FROM public.vehicles v;

-- Inserir imagens adicionais
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary, display_order)
SELECT 
    v.id,
    '/placeholder.svg?height=400&width=600&text=Interior+' || encode(v.name::bytea, 'base64'),
    false,
    1
FROM public.vehicles v;

INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary, display_order)
SELECT 
    v.id,
    '/placeholder.svg?height=400&width=600&text=Lateral+' || encode(v.name::bytea, 'base64'),
    false,
    2
FROM public.vehicles v;

-- Inserir características por categoria
INSERT INTO public.vehicle_features (vehicle_id, feature)
SELECT v.id, f.feature
FROM public.vehicles v
CROSS JOIN (
    SELECT unnest(ARRAY[
        'Ar condicionado digital',
        'Direção elétrica',
        'Vidros elétricos',
        'Travas elétricas',
        'Airbag duplo',
        'ABS',
        'Controle de estabilidade',
        'Sensor de estacionamento',
        'Câmera de ré',
        'Central multimídia'
    ]) as feature
) f
WHERE v.category = 'novos';

INSERT INTO public.vehicle_features (vehicle_id, feature)
SELECT v.id, f.feature
FROM public.vehicles v
CROSS JOIN (
    SELECT unnest(ARRAY[
        'Ar condicionado',
        'Direção hidráulica',
        'Vidros elétricos',
        'Travas elétricas',
        'Airbag duplo',
        'ABS',
        'Alarme',
        'Som original',
        'Limpador traseiro',
        'Desembaçador traseiro'
    ]) as feature
) f
WHERE v.category = 'seminovos';

INSERT INTO public.vehicle_features (vehicle_id, feature)
SELECT v.id, f.feature
FROM public.vehicles v
CROSS JOIN (
    SELECT unnest(ARRAY[
        'Ar condicionado automático',
        'Direção elétrica',
        'Vidros elétricos',
        'Travas elétricas',
        'Airbags múltiplos',
        'ABS + EBD',
        'Controle de tração',
        'Sensor de chuva',
        'Faróis de LED',
        'Bancos em couro',
        'Teto solar',
        'Sistema de som premium'
    ]) as feature
) f
WHERE v.category = 'premium';

INSERT INTO public.vehicle_features (vehicle_id, feature)
SELECT v.id, f.feature
FROM public.vehicles v
CROSS JOIN (
    SELECT unnest(ARRAY[
        'Ar condicionado',
        'Direção assistida',
        'Vidros elétricos dianteiros',
        'Travas elétricas',
        'Airbag duplo',
        'ABS',
        'Som MP3',
        'Volante com comandos'
    ]) as feature
) f
WHERE v.category = 'ofertas';

-- Verificar dados inseridos
SELECT 
    'DADOS INSERIDOS' as status,
    (SELECT count(*) FROM public.vehicles) as veiculos,
    (SELECT count(*) FROM public.vehicle_images) as imagens,
    (SELECT count(*) FROM public.vehicle_features) as caracteristicas;
