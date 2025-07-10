-- Insert sample vehicles with proper UUIDs
DO $$
DECLARE
    seller_uuid UUID;
    vehicle_uuid UUID;
BEGIN
    -- Get seller info UUID
    SELECT id INTO seller_uuid FROM seller_info LIMIT 1;
    
    -- Insert Honda Civic 2023 (NOVO)
    INSERT INTO vehicles (
        name, brand, model, year, price, mileage, fuel, transmission, color, seats,
        description, tag, category, is_active
    ) VALUES (
        'Honda Civic 2023', 'Honda', 'Civic', 2023, 125000.00, 0, 'Flex', 'Automático', 'Branco Pérola', 5,
        'Honda Civic 2023 zero quilômetro, representando o que há de mais moderno em tecnologia automotiva. Equipado com motor 2.0 i-VTEC, oferece performance excepcional e economia de combustível.',
        'NOVO', 'novos', true
    ) RETURNING id INTO vehicle_uuid;
    
    -- Insert images for Honda Civic
    INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES
    (vehicle_uuid, '/placeholder.svg?height=400&width=600', true);
    
    -- Insert features for Honda Civic
    INSERT INTO vehicle_features (vehicle_id, feature) VALUES
    (vehicle_uuid, 'Motor 2.0 i-VTEC Flex'),
    (vehicle_uuid, 'Transmissão CVT'),
    (vehicle_uuid, 'Ar condicionado digital dual zone'),
    (vehicle_uuid, 'Central multimídia 9 polegadas'),
    (vehicle_uuid, 'Bancos em couro premium'),
    (vehicle_uuid, 'Rodas de liga leve 17 polegadas'),
    (vehicle_uuid, 'Faróis full LED'),
    (vehicle_uuid, 'Sistema Honda SENSING');

    -- Insert Toyota Corolla 2022 (SEMINOVO)
    INSERT INTO vehicles (
        name, brand, model, year, price, mileage, fuel, transmission, color, seats,
        description, tag, category, is_active
    ) VALUES (
        'Toyota Corolla 2022', 'Toyota', 'Corolla', 2022, 115000.00, 15000, 'Flex', 'CVT', 'Prata Metallic', 5,
        'Toyota Corolla 2022 seminovo em estado impecável, com apenas 15.000 km rodados. Revisões em dia na concessionária autorizada.',
        'SEMINOVO', 'seminovos', true
    ) RETURNING id INTO vehicle_uuid;
    
    -- Insert images for Toyota Corolla
    INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES
    (vehicle_uuid, '/placeholder.svg?height=400&width=600', true);
    
    -- Insert features for Toyota Corolla
    INSERT INTO vehicle_features (vehicle_id, feature) VALUES
    (vehicle_uuid, 'Motor 2.0 Dynamic Force Flex'),
    (vehicle_uuid, 'Transmissão CVT'),
    (vehicle_uuid, 'Toyota Safety Sense'),
    (vehicle_uuid, 'Ar condicionado automático'),
    (vehicle_uuid, 'Central multimídia Toyota'),
    (vehicle_uuid, 'Bancos em couro sintético');

    -- Insert BMW X3 2021 (PREMIUM)
    INSERT INTO vehicles (
        name, brand, model, year, price, mileage, fuel, transmission, color, seats,
        description, tag, category, is_active
    ) VALUES (
        'BMW X3 2021', 'BMW', 'X3', 2021, 280000.00, 25000, 'Gasolina', 'Automático', 'Preto Sapphire', 5,
        'BMW X3 2021 premium em estado excepcional, único dono executivo, sempre concessionária autorizada.',
        'PREMIUM', 'premium', true
    ) RETURNING id INTO vehicle_uuid;
    
    -- Insert images for BMW X3
    INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES
    (vehicle_uuid, '/placeholder.svg?height=400&width=600', true);
    
    -- Insert features for BMW X3
    INSERT INTO vehicle_features (vehicle_id, feature) VALUES
    (vehicle_uuid, 'Motor 2.0 TwinPower Turbo'),
    (vehicle_uuid, 'Transmissão Steptronic 8 marchas'),
    (vehicle_uuid, 'Tração xDrive integral'),
    (vehicle_uuid, 'Sistema iDrive 7.0'),
    (vehicle_uuid, 'Bancos em couro Dakota'),
    (vehicle_uuid, 'Faróis adaptativos LED');

    -- Insert Volkswagen Polo 2022 (OFERTA ESPECIAL)
    INSERT INTO vehicles (
        name, brand, model, year, price, original_price, mileage, fuel, transmission, color, seats,
        description, tag, category, is_active
    ) VALUES (
        'Volkswagen Polo 2022', 'Volkswagen', 'Polo', 2022, 78000.00, 85000.00, 35000, 'Flex', 'Manual', 'Azul Silk', 5,
        'Volkswagen Polo 2022 em oferta especial! Hatch premium com design europeu e qualidade alemã.',
        'OFERTA ESPECIAL', 'ofertas', true
    ) RETURNING id INTO vehicle_uuid;
    
    -- Insert images for Volkswagen Polo
    INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES
    (vehicle_uuid, '/placeholder.svg?height=400&width=600', true);
    
    -- Insert features for Volkswagen Polo
    INSERT INTO vehicle_features (vehicle_id, feature) VALUES
    (vehicle_uuid, 'Motor 1.0 TSI Turbo'),
    (vehicle_uuid, 'Transmissão manual 5 marchas'),
    (vehicle_uuid, 'Sistema VW Connect'),
    (vehicle_uuid, 'Ar condicionado manual'),
    (vehicle_uuid, 'Central Composition Touch'),
    (vehicle_uuid, 'Rodas de liga leve 15 polegadas');

    -- Insert Hyundai HB20 2023 (NOVO)
    INSERT INTO vehicles (
        name, brand, model, year, price, mileage, fuel, transmission, color, seats,
        description, tag, category, is_active
    ) VALUES (
        'Hyundai HB20 2023', 'Hyundai', 'HB20', 2023, 75000.00, 0, 'Flex', 'Manual', 'Azul Ocean', 5,
        'Hyundai HB20 2023 zero quilômetro, o hatch compacto mais vendido do Brasil.',
        'NOVO', 'novos', true
    ) RETURNING id INTO vehicle_uuid;
    
    -- Insert images for Hyundai HB20
    INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES
    (vehicle_uuid, '/placeholder.svg?height=400&width=600', true);
    
    -- Insert features for Hyundai HB20
    INSERT INTO vehicle_features (vehicle_id, feature) VALUES
    (vehicle_uuid, 'Motor 1.0 Turbo GDI'),
    (vehicle_uuid, 'Transmissão manual 6 marchas'),
    (vehicle_uuid, 'Ar condicionado manual'),
    (vehicle_uuid, 'Central multimídia 8 polegadas'),
    (vehicle_uuid, 'Volante multifuncional'),
    (vehicle_uuid, 'Rodas de liga leve 15 polegadas');

END $$;
