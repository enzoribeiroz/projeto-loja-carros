-- Insert default seller info
INSERT INTO public.seller_info (name, avatar, rating, phone, whatsapp) 
VALUES ('AutoMax Concessionária', '/placeholder.svg?height=50&width=50', 4.8, '(11) 999999999', '(11) 999999999');

-- Insert initial vehicles (first 5 as example)
INSERT INTO public.vehicles (id, name, price, year, mileage, fuel, seats, color, transmission, description, tag) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Honda Civic 2023', 'R$ 125.000', '2023', '0 km', 'Flex', '5 lugares', 'Branco Pérola', 'Automático', 'Honda Civic 2023 zero quilômetro, representando o que há de mais moderno em tecnologia automotiva. Equipado com motor 2.0 i-VTEC, oferece performance excepcional e economia de combustível. Interior sofisticado com acabamentos premium, bancos em couro legítimo e sistema de infotainment de última geração. Ideal para quem busca conforto, segurança e status em um sedan de luxo.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440002', 'Toyota Corolla 2022', 'R$ 115.000', '2022', '15.000 km', 'Flex', '5 lugares', 'Prata Metallic', 'CVT', 'Toyota Corolla 2022 seminovo em estado impecável, com apenas 15.000 km rodados. Revisões em dia na concessionária autorizada, garantia de fábrica ainda válida. Motor 2.0 Dynamic Force com tecnologia híbrida flex, oferecendo economia excepcional. Interior premium com acabamentos refinados e tecnologia Toyota Safety Sense. Histórico de manutenção completo disponível.', 'SEMINOVO'),
('550e8400-e29b-41d4-a716-446655440003', 'BMW X3 2021', 'R$ 280.000', '2021', '25.000 km', 'Gasolina', '5 lugares', 'Preto Sapphire', 'Automático', 'BMW X3 2021 premium em estado excepcional, único dono executivo, sempre concessionária autorizada. SUV de luxo com motor TwinPower Turbo, tração xDrive integral e suspensão adaptativa. Interior em couro Dakota com acabamentos em madeira. Tecnologia iDrive 7.0 e pacote de assistência ao motorista. Símbolo de status e performance.', 'PREMIUM'),
('550e8400-e29b-41d4-a716-446655440004', 'Hyundai HB20 2023', 'R$ 75.000', '2023', '0 km', 'Flex', '5 lugares', 'Azul Ocean', 'Manual', 'Hyundai HB20 2023 zero quilômetro, o hatch compacto mais vendido do Brasil. Combina design moderno, economia e praticidade urbana. Motor 1.0 Turbo GDI oferece excelente performance com baixo consumo. Interior espaçoso e bem acabado, com tecnologia de conectividade avançada. Perfeito para quem busca um carro confiável e econômico para o dia a dia.', 'NOVO'),
('550e8400-e29b-41d4-a716-446655440005', 'Volkswagen Polo 2022', 'R$ 78.000', '2022', '35.000 km', 'Flex', '5 lugares', 'Azul Silk', 'Manual', 'Volkswagen Polo 2022 em oferta especial! Hatch premium com design europeu e qualidade alemã. Motor TSI turbo eficiente, interior bem acabado e tecnologia VW Connect. Oportunidade única com desconto especial para venda rápida. Ideal para quem busca qualidade Volkswagen com excelente custo-benefício.', 'OFERTA ESPECIAL');

-- Update the offer vehicle with original price
UPDATE public.vehicles SET original_price = 'R$ 85.000' WHERE id = '550e8400-e29b-41d4-a716-446655440005';

-- Insert vehicle images
INSERT INTO public.vehicle_images (vehicle_id, image_url, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=400&width=600', true),
('550e8400-e29b-41d4-a716-446655440002', '/placeholder.svg?height=400&width=600', true),
('550e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=400&width=600', true),
('550e8400-e29b-41d4-a716-446655440004', '/placeholder.svg?height=400&width=600', true),
('550e8400-e29b-41d4-a716-446655440005', '/placeholder.svg?height=400&width=600', true);

-- Insert vehicle features for Honda Civic
INSERT INTO public.vehicle_features (vehicle_id, feature) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Motor 2.0 i-VTEC Flex'),
('550e8400-e29b-41d4-a716-446655440001', 'Transmissão CVT'),
('550e8400-e29b-41d4-a716-446655440001', 'Ar condicionado digital dual zone'),
('550e8400-e29b-41d4-a716-446655440001', 'Central multimídia 9 polegadas'),
('550e8400-e29b-41d4-a716-446655440001', 'Bancos em couro premium'),
('550e8400-e29b-41d4-a716-446655440001', 'Rodas de liga leve 17 polegadas'),
('550e8400-e29b-41d4-a716-446655440001', 'Faróis full LED'),
('550e8400-e29b-41d4-a716-446655440001', 'Sistema Honda SENSING');

-- Insert vehicle features for Toyota Corolla
INSERT INTO public.vehicle_features (vehicle_id, feature) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Motor 2.0 Dynamic Force Flex'),
('550e8400-e29b-41d4-a716-446655440002', 'Transmissão CVT'),
('550e8400-e29b-41d4-a716-446655440002', 'Toyota Safety Sense'),
('550e8400-e29b-41d4-a716-446655440002', 'Ar condicionado automático'),
('550e8400-e29b-41d4-a716-446655440002', 'Central multimídia Toyota'),
('550e8400-e29b-41d4-a716-446655440002', 'Bancos em couro sintético'),
('550e8400-e29b-41d4-a716-446655440002', 'Rodas de liga leve 16 polegadas'),
('550e8400-e29b-41d4-a716-446655440002', 'Faróis LED');
