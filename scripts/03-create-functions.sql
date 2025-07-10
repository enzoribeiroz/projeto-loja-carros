-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    CASE 
      WHEN NEW.email IN ('admin@automax.com', 'test1@test.com', 'gerente@automax.com') 
      THEN true 
      ELSE false 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get vehicle with all related data
CREATE OR REPLACE FUNCTION public.get_vehicle_details(vehicle_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', v.id,
    'name', v.name,
    'price', v.price,
    'original_price', v.original_price,
    'year', v.year,
    'mileage', v.mileage,
    'fuel', v.fuel,
    'seats', v.seats,
    'color', v.color,
    'transmission', v.transmission,
    'description', v.description,
    'tag', v.tag,
    'location', v.location,
    'created_at', v.created_at,
    'images', COALESCE(
      (SELECT json_agg(vi.image_url ORDER BY vi.is_primary DESC, vi.created_at)
       FROM public.vehicle_images vi WHERE vi.vehicle_id = v.id), 
      '[]'::json
    ),
    'features', COALESCE(
      (SELECT json_agg(vf.feature ORDER BY vf.created_at)
       FROM public.vehicle_features vf WHERE vf.vehicle_id = v.id), 
      '[]'::json
    ),
    'seller', (
      SELECT json_build_object(
        'name', si.name,
        'avatar', si.avatar,
        'rating', si.rating,
        'phone', si.phone,
        'whatsapp', si.whatsapp
      )
      FROM public.seller_info si
      LIMIT 1
    )
  ) INTO result
  FROM public.vehicles v
  WHERE v.id = vehicle_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
