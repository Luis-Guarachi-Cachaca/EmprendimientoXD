-- Agregar campos adicionales a la tabla de productos
-- Ejecutar esto en el SQL Editor de Supabase

-- Agregar campos de descuento
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_price NUMERIC;

-- Agregar campo de disponibilidad
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Agregar campo de género
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('unisex', 'men', 'women', 'kids'));

-- Crear función para calcular final_price automáticamente
CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_percentage IS NOT NULL AND NEW.discount_percentage > 0 THEN
    NEW.final_price = NEW.price * (1 - NEW.discount_percentage / 100);
  ELSE
    NEW.final_price = NEW.price;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar final_price automáticamente
DROP TRIGGER IF EXISTS update_final_price ON products;
CREATE TRIGGER update_final_price
  BEFORE INSERT OR UPDATE OF price, discount_percentage ON products
  FOR EACH ROW
  EXECUTE FUNCTION calculate_final_price();

-- Actualizar final_price para productos existentes
UPDATE products 
SET final_price = price * (1 - COALESCE(discount_percentage, 0) / 100)
WHERE final_price IS NULL;
