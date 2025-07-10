-- Insert default seller info
INSERT INTO seller_info (name, avatar, rating, phone, whatsapp) 
VALUES (
    'AutoMax Concessionária',
    '/placeholder.svg?height=48&width=48',
    4.8,
    '(11) 99999-9999',
    '11999999999'
) ON CONFLICT DO NOTHING;

-- Insert admin user (will be created when they first sign up)
-- The trigger will handle the user creation in auth.users
