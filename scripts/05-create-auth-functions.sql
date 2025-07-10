-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    is_admin_user BOOLEAN := FALSE;
BEGIN
    -- Check if email is in admin list
    IF NEW.email = 'caio@caio.com' THEN
        is_admin_user := TRUE;
    END IF;

    -- Insert user into public.users table
    INSERT INTO public.users (id, email, name, is_admin, profile_complete)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        is_admin_user,
        CASE WHEN NEW.raw_user_meta_data->>'name' IS NOT NULL THEN TRUE ELSE FALSE END
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to sync user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user in public.users table
    UPDATE public.users
    SET 
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', name),
        updated_at = NOW()
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
