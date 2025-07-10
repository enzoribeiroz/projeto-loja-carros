-- Limpar dados existentes (opcional)
DELETE FROM public.vehicle_features;
DELETE FROM public.vehicle_images;
DELETE FROM public.vehicles;

-- Inserir todos os 30 veículos
INSERT INTO public.vehicles (id, name, price, original_price, year, mileage, fuel, seats, color, transmission, description, tag) VALUES
-- NOVOS
('550e8400-e29b-41d4-a716-446655440001', 'Honda Civic 2023', 'R$ 125.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Branco Pérola', 'Automático', 'Honda Civic 2023 zero quilômetro, representando o que há de mais moderno em tecnologia automotiva. Equipado com motor 2.0 i-VTEC, oferece performance excepcional e economia de combustível.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440004', 'Hyundai HB20 2023', 'R$ 75.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Azul Ocean', 'Manual', 'Hyundai HB20 2023 zero quilômetro, o hatch compacto mais vendido do Brasil. Combina design moderno, economia e praticidade urbana.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440007', 'Jeep Compass 2023', 'R$ 145.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Preto Carbon', 'Automático', 'Jeep Compass 2023 zero quilômetro, o SUV que combina robustez e sofisticação. Motor Turbo Flex de alta performance.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440013', 'Toyota Hilux 2023', 'R$ 185.000', NULL, '2023', '0 km', 'Diesel', '5 lugares', 'Branco Polar', 'Automático', 'Toyota Hilux 2023 zero quilômetro, a picape mais confiável do mercado brasileiro. Motor diesel 2.8 turbo.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440015', 'Volkswagen T-Cross 2023', 'R$ 95.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Cinza Platinum', 'Automático', 'Volkswagen T-Cross 2023 zero quilômetro, o SUV compacto que redefine versatilidade urbana.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440017', 'Renault Kwid 2023', 'R$ 55.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Laranja Sunset', 'Manual', 'Renault Kwid 2023 zero quilômetro, o carro ideal para quem busca economia e praticidade.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440019', 'BMW 320i 2023', 'R$ 245.000', NULL, '2023', '0 km', 'Gasolina', '5 lugares', 'Azul Storm Bay', 'Automático', 'BMW 320i 2023 zero quilômetro, o sedan premium que define luxo e performance.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440021', 'Mercedes-Benz GLA 2023', 'R$ 265.000', NULL, '2023', '0 km', 'Gasolina', '5 lugares', 'Prata Iridium', 'Automático', 'Mercedes-Benz GLA 2023 zero quilômetro, o SUV compacto de luxo que combina elegância e versatilidade.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440023', 'Land Rover Evoque 2023', 'R$ 385.000', NULL, '2023', '0 km', 'Gasolina', '5 lugares', 'Preto Santorini', 'Automático', 'Land Rover Evoque 2023 zero quilômetro, o SUV coupé que revolucionou o segmento premium.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440025', 'Chevrolet Tracker 2023', 'R$ 115.000', NULL, '2023', '0 km', 'Turbo', '5 lugares', 'Vermelho Cherry', 'Automático', 'Chevrolet Tracker 2023 zero quilômetro, o SUV que combina tecnologia, segurança e design arrojado.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440027', 'Toyota SW4 2023', 'R$ 295.000', NULL, '2023', '0 km', 'Diesel', '7 lugares', 'Prata Metallic', 'Automático', 'Toyota SW4 2023 zero quilômetro, o SUV 7 lugares mais robusto e confiável do mercado.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440029', 'Volkswagen Jetta 2023', 'R$ 135.000', NULL, '2023', '0 km', 'Flex', '5 lugares', 'Branco Cristal', 'Automático', 'Volkswagen Jetta 2023 zero quilômetro, o sedan que combina elegância alemã e tecnologia brasileira.', 'NOVO'),

-- SEMINOVOS
('550e8400-e29b-41d4-a716-446655440002', 'Toyota Corolla 2022', 'R$ 115.000', NULL, '2022', '15.000 km', 'Flex', '5 lugares', 'Prata Metallic', 'CVT', 'Toyota Corolla 2022 seminovo em estado impecável, com apenas 15.000 km rodados.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440014', 'Honda HR-V 2022', 'R$ 105.000', NULL, '2022', '22.000 km', 'Flex', '5 lugares', 'Azul Cosmic', 'CVT', 'Honda HR-V 2022 seminovo em excelente conservação, único dono, sempre na concessionária.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440016', 'Fiat Argo 2022', 'R$ 68.000', NULL, '2022', '28.000 km', 'Flex', '5 lugares', 'Vermelho Marsala', 'Manual', 'Fiat Argo 2022 seminovo bem conservado, segundo dono, com histórico de manutenção em dia.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440018', 'Peugeot 208 2022', 'R$ 72.000', NULL, '2022', '25.000 km', 'Flex', '5 lugares', 'Cinza Shark', 'Automático', 'Peugeot 208 2022 seminovo em ótimo estado, único dono, sempre garagem.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440022', 'Volvo XC60 2022', 'R$ 285.000', NULL, '2022', '18.000 km', 'Gasolina', '5 lugares', 'Azul Denim', 'Automático', 'Volvo XC60 2022 seminovo impecável, único dono executivo, sempre concessionária.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440024', 'Ford EcoSport 2022', 'R$ 78.000', NULL, '2022', '32.000 km', 'Flex', '5 lugares', 'Branco Oxford', 'Automático', 'Ford EcoSport 2022 seminovo bem cuidado, segundo dono, com manutenção preventiva em dia.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440026', 'Hyundai Creta 2022', 'R$ 98.000', NULL, '2022', '20.000 km', 'Flex', '5 lugares', 'Cinza Titanium', 'Automático', 'Hyundai Creta 2022 seminovo em estado de zero, único dono, sempre garagem.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440028', 'Honda City 2022', 'R$ 88.000', NULL, '2022', '24.000 km', 'Flex', '5 lugares', 'Preto Cristal', 'CVT', 'Honda City 2022 seminovo impecável, único dono, sempre concessionária.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440030', 'Nissan Sentra 2022', 'R$ 92.000', NULL, '2022', '26.000 km', 'Flex', '5 lugares', 'Prata Brilliant', 'CVT', 'Nissan Sentra 2022 seminovo bem conservado, segundo dono, com histórico completo.', 'SEMINOVO'),

-- PREMIUM
('550e8400-e29b-41d4-a716-446655440003', 'BMW X3 2021', 'R$ 280.000', NULL, '2021', '25.000 km', 'Gasolina', '5 lugares', 'Preto Sapphire', 'Automático', 'BMW X3 2021 premium em estado excepcional, único dono executivo, sempre concessionária autorizada.', 'PREMIUM'),
('550e8400-e29b-41d4-a716-446655440006', 'Audi A4 2022', 'R$ 195.000', NULL, '2022', '12.000 km', 'Gasolina', '5 lugares', 'Cinza Quantum', 'Automático', 'Audi A4 2022 premium seminovo impecável, único dono, baixíssima quilometragem.', 'PREMIUM'),
('550e8400-e29b-41d4-a716-446655440011', 'Mercedes-Benz C180 2023', 'R$ 225.000', NULL, '2023', '8.000 km', 'Gasolina', '5 lugares', 'Branco Polar', 'Automático', 'Mercedes-Benz C180 2023 premium seminovo em estado de zero, único dono, baixíssima quilometragem.', 'PREMIUM'),
('550e8400-e29b-41d4-a716-446655440012', 'Porsche Macan 2022', 'R$ 385.000', NULL, '2022', '15.000 km', 'Gasolina', '5 lugares', 'Azul Gentian', 'Automático', 'Porsche Macan 2022 premium em estado excepcional, único dono colecionador, sempre garagem climatizada.', 'PREMIUM'),
('550e8400-e29b-41d4-a716-446655440020', 'Audi Q3 2022', 'R$ 215.000', NULL, '2022', '18.000 km', 'Gasolina', '5 lugares', 'Vermelho Tango', 'Automático', 'Audi Q3 2022 premium seminovo impecável, único dono, sempre concessionária.', 'PREMIUM'),

-- OFERTAS ESPECIAIS
('550e8400-e29b-41d4-a716-446655440005', 'Volkswagen Polo 2022', 'R$ 78.000', 'R$ 85.000', '2022', '35.000 km', 'Flex', '5 lugares', 'Azul Silk', 'Manual', 'Volkswagen Polo 2022 em oferta especial! Hatch premium com design europeu e qualidade alemã.', 'OFERTA ESPECIAL'),
('550e8400-e29b-41d4-a716-446655440008', 'Nissan Kicks 2022', 'R$ 88.000', 'R$ 95.000', '2022', '30.000 km', 'Flex', '5 lugares', 'Laranja Energy', 'CVT', 'Nissan Kicks 2022 em super oferta! SUV compacto com design arrojado e interior espaçoso.', 'OFERTA ESPECIAL'),
('550e8400-e29b-41d4-a716-446655440009', 'Ford Ka 2023', 'R$ 58.000', 'R$ 65.000', '2023', '12.000 km', 'Flex', '5 lugares', 'Branco Oxford', 'Manual', 'Ford Ka 2023 em oferta imperdível! Hatch compacto zero quilômetro com desconto especial.', 'OFERTA ESPECIAL'),
('550e8400-e29b-41d4-a716-446655440010', 'Chevrolet Onix 2022', 'R$ 68.000', 'R$ 75.000', '2022', '28.000 km', 'Flex', '5 lugares', 'Prata Switchblade', 'Automático', 'Chevrolet Onix 2022 em oferta especial! Hatch líder de vendas com motor turbo e transmissão automática.', 'OFERTA ESPECIAL');

-- Inserir imagens para todos os veículos
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary) 
SELECT id, '/placeholder.svg?height=400&width=600', true 
FROM public.vehicles;

-- Inserir algumas features básicas para cada veículo
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
('550e8400-e29b-41d4-a716-446655440003', 'Sistema de som Harman Kardon');

-- Adicionar features básicas para os demais veículos
INSERT INTO public.vehicle_features (vehicle_id, feature) 
SELECT id, 'Ar condicionado' FROM public.vehicles WHERE id NOT IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
);

INSERT INTO public.vehicle_features (vehicle_id, feature) 
SELECT id, 'Direção elétrica' FROM public.vehicles WHERE id NOT IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
);

INSERT INTO public.vehicle_features (vehicle_id, feature) 
SELECT id, 'Vidros elétricos' FROM public.vehicles WHERE id NOT IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
);

INSERT INTO public.vehicle_features (vehicle_id, feature) 
SELECT id, 'Freios ABS' FROM public.vehicles WHERE id NOT IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
);
