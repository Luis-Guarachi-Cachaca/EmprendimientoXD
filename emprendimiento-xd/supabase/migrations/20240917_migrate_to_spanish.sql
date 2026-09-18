-- ============================================================
-- GLOWSPOT · Migración a Español y Normalización (v2 corregida)
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

BEGIN;

-- ============================================================
-- PASO 1: Crear nuevas tablas normalizadas (generos y marcas)
-- ============================================================

CREATE TABLE IF NOT EXISTS generos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  slug        text not null unique,
  descripcion text,
  orden_ordenamiento int not null default 0,
  es_activo   boolean not null default true,
  fecha_creacion timestamptz not null default now()
);

INSERT INTO generos (nombre, slug, descripcion, orden_ordenamiento) VALUES
  ('Unisex', 'unisex', 'Productos para todas las personas', 1),
  ('Para Él', 'para-el', 'Productos de cuidado masculino', 2),
  ('Para Ella', 'para-ella', 'Productos de cuidado femenino', 3),
  ('Niños', 'ninos', 'Productos para los más pequeños', 4)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS marcas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  slug        text not null unique,
  descripcion text,
  orden_ordenamiento int not null default 0,
  es_activo   boolean not null default true,
  fecha_creacion timestamptz not null default now()
);

INSERT INTO marcas (nombre, slug, descripcion, orden_ordenamiento)
SELECT DISTINCT 
  brand_line as nombre,
  lower(regexp_replace(brand_line, '[^a-zA-Z0-9]+', '-', 'g')) as slug,
  brand_line as descripcion,
  0 as orden_ordenamiento
FROM products 
WHERE brand_line IS NOT NULL AND brand_line != ''
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- ============================================================
-- PASO 2: Renombrar tablas existentes a español
-- ============================================================

ALTER TABLE categories RENAME TO categorias;
ALTER TABLE products RENAME TO productos;
ALTER TABLE product_images RENAME TO imagenes_productos;
ALTER TABLE delivery_points RENAME TO puntos_entrega;
ALTER TABLE contacts RENAME TO contactos;
ALTER TABLE site_config RENAME TO configuracion_sitio;

-- ============================================================
-- PASO 3: Renombrar columnas en cada tabla
-- ============================================================

ALTER TABLE categorias RENAME COLUMN name TO nombre;
ALTER TABLE categorias RENAME COLUMN description TO descripcion;
ALTER TABLE categorias RENAME COLUMN sort_order TO orden_ordenamiento;
ALTER TABLE categorias RENAME COLUMN is_active TO es_activo;
ALTER TABLE categorias RENAME COLUMN created_at TO fecha_creacion;

ALTER TABLE productos RENAME COLUMN name TO nombre;
ALTER TABLE productos RENAME COLUMN short_description TO descripcion_corta;
ALTER TABLE productos RENAME COLUMN description TO descripcion_completa;
ALTER TABLE productos RENAME COLUMN brand_line TO marca_id_temp;
ALTER TABLE productos RENAME COLUMN price TO precio;
ALTER TABLE productos RENAME COLUMN discount_percentage TO porcentaje_descuento;
ALTER TABLE productos RENAME COLUMN final_price TO precio_final;
ALTER TABLE productos RENAME COLUMN image_url TO url_imagen;
ALTER TABLE productos RENAME COLUMN category_id TO categoria_id;
ALTER TABLE productos RENAME COLUMN is_new TO es_nuevo;
ALTER TABLE productos RENAME COLUMN is_active TO es_activo;
ALTER TABLE productos RENAME COLUMN is_available TO esta_disponible;
ALTER TABLE productos RENAME COLUMN gender TO genero_id_temp;
ALTER TABLE productos RENAME COLUMN sort_order TO orden_ordenamiento;
ALTER TABLE productos RENAME COLUMN created_at TO fecha_creacion;
ALTER TABLE productos RENAME COLUMN updated_at TO fecha_actualizacion;

ALTER TABLE imagenes_productos RENAME COLUMN product_id TO producto_id;
ALTER TABLE imagenes_productos RENAME COLUMN image_url TO url_imagen;
ALTER TABLE imagenes_productos RENAME COLUMN alt_text TO texto_alternativo;
ALTER TABLE imagenes_productos RENAME COLUMN sort_order TO orden_ordenamiento;
ALTER TABLE imagenes_productos RENAME COLUMN is_primary TO es_principal;
ALTER TABLE imagenes_productos RENAME COLUMN created_at TO fecha_creacion;

ALTER TABLE puntos_entrega RENAME COLUMN name TO nombre;
ALTER TABLE puntos_entrega RENAME COLUMN description TO descripcion;
ALTER TABLE puntos_entrega RENAME COLUMN sort_order TO orden_ordenamiento;
ALTER TABLE puntos_entrega RENAME COLUMN is_active TO es_activo;
ALTER TABLE puntos_entrega RENAME COLUMN created_at TO fecha_creacion;

ALTER TABLE contactos RENAME COLUMN type TO tipo;
ALTER TABLE contactos RENAME COLUMN label TO etiqueta;
ALTER TABLE contactos RENAME COLUMN value TO valor;
ALTER TABLE contactos RENAME COLUMN sort_order TO orden_ordenamiento;
ALTER TABLE contactos RENAME COLUMN is_active TO es_activo;
ALTER TABLE contactos RENAME COLUMN created_at TO fecha_creacion;

ALTER TABLE configuracion_sitio RENAME COLUMN company_name TO nombre_empresa;
ALTER TABLE configuracion_sitio RENAME COLUMN logo_url TO url_logo;
ALTER TABLE configuracion_sitio RENAME COLUMN hero_badge TO insignia_hero;
ALTER TABLE configuracion_sitio RENAME COLUMN hero_title TO titulo_hero;
ALTER TABLE configuracion_sitio RENAME COLUMN hero_description TO descripcion_hero;
ALTER TABLE configuracion_sitio RENAME COLUMN hero_image_url TO url_imagen_hero;
ALTER TABLE configuracion_sitio RENAME COLUMN shipping_note TO nota_envio;
ALTER TABLE configuracion_sitio RENAME COLUMN audience_note TO nota_audiencia;
ALTER TABLE configuracion_sitio RENAME COLUMN contact_location TO ubicacion_contacto;
ALTER TABLE configuracion_sitio RENAME COLUMN footer_description TO descripcion_pie_pagina;
ALTER TABLE configuracion_sitio RENAME COLUMN updated_at TO fecha_actualizacion;

-- ============================================================
-- PASO 4 (MOVIDO): Arreglar triggers y funciones ANTES de tocar datos
-- Orden correcto: primero DROP TRIGGER, luego DROP FUNCTION,
-- luego CREATE FUNCTION, luego CREATE TRIGGER.
-- ============================================================

DROP TRIGGER IF EXISTS products_updated_at ON productos;
DROP TRIGGER IF EXISTS productos_actualizados ON productos;
DROP FUNCTION IF EXISTS set_updated_at();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_actualizados
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS update_final_price ON productos;
DROP FUNCTION IF EXISTS calculate_final_price();

CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.porcentaje_descuento IS NOT NULL AND NEW.porcentaje_descuento > 0 THEN
    NEW.precio_final = NEW.precio * (1 - NEW.porcentaje_descuento / 100);
  ELSE
    NEW.precio_final = NEW.precio;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actualizar_precio_final
  BEFORE INSERT OR UPDATE OF precio, porcentaje_descuento ON productos
  FOR EACH ROW
  EXECUTE FUNCTION calculate_final_price();

-- ============================================================
-- PASO 5: Migrar datos de texto a foreign keys
-- ============================================================

ALTER TABLE productos ADD COLUMN IF NOT EXISTS genero_id uuid REFERENCES generos(id) ON DELETE SET NULL;

UPDATE productos p
SET genero_id = g.id
FROM generos g
WHERE p.genero_id_temp IS NOT NULL 
  AND p.genero_id_temp != ''
  AND g.slug = p.genero_id_temp;

ALTER TABLE productos ADD COLUMN IF NOT EXISTS marca_id uuid REFERENCES marcas(id) ON DELETE SET NULL;

UPDATE productos p
SET marca_id = m.id
FROM marcas m
WHERE p.marca_id_temp IS NOT NULL 
  AND p.marca_id_temp != ''
  AND m.nombre = p.marca_id_temp;

-- ============================================================
-- PASO 6: Eliminar columnas temporales y actualizar constraints
-- ============================================================

ALTER TABLE productos DROP COLUMN IF EXISTS genero_id_temp;
ALTER TABLE productos DROP COLUMN IF EXISTS marca_id_temp;

ALTER TABLE contactos DROP CONSTRAINT IF EXISTS contactos_type_check;
ALTER TABLE contactos ADD CONSTRAINT contactos_tipo_check 
  CHECK (tipo IN ('whatsapp', 'email', 'phone', 'other'));

-- ============================================================
-- PASO 7: Actualizar índices
-- ============================================================

DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_is_active;
DROP INDEX IF EXISTS idx_products_is_new;
DROP INDEX IF EXISTS idx_products_name_trgm;
DROP INDEX IF EXISTS idx_product_images_product;

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_es_activo ON productos(es_activo);
CREATE INDEX IF NOT EXISTS idx_productos_es_nuevo ON productos(es_nuevo);
CREATE INDEX IF NOT EXISTS idx_productos_nombre_trgm ON productos USING gin (nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_imagenes_productos_producto ON imagenes_productos(producto_id);

-- ============================================================
-- PASO 8: Actualizar Row Level Security (RLS)
-- ============================================================

DROP POLICY IF EXISTS "Categorías visibles para todos" ON categorias;
DROP POLICY IF EXISTS "Productos activos visibles" ON productos;
DROP POLICY IF EXISTS "Imágenes de productos visibles" ON imagenes_productos;
DROP POLICY IF EXISTS "Puntos de entrega visibles" ON puntos_entrega;
DROP POLICY IF EXISTS "Contactos visibles" ON contactos;
DROP POLICY IF EXISTS "Configuración del sitio visible" ON configuracion_sitio;

CREATE POLICY "Categorias visibles para todos"
  ON categorias FOR SELECT USING (es_activo = true);

CREATE POLICY "Productos activos visibles"
  ON productos FOR SELECT USING (es_activo = true);

CREATE POLICY "Imagenes de productos visibles"
  ON imagenes_productos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM productos
      WHERE productos.id = imagenes_productos.producto_id
        AND productos.es_activo = true
    )
  );

CREATE POLICY "Puntos de entrega visibles"
  ON puntos_entrega FOR SELECT USING (es_activo = true);

CREATE POLICY "Contactos visibles"
  ON contactos FOR SELECT USING (es_activo = true);

CREATE POLICY "Configuracion del sitio visible"
  ON configuracion_sitio FOR SELECT USING (true);

ALTER TABLE generos ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Generos visibles para todos"
  ON generos FOR SELECT USING (es_activo = true);

CREATE POLICY "Marcas visibles para todas"
  ON marcas FOR SELECT USING (es_activo = true);

-- ============================================================
-- PASO 9: Verificación de migración
-- ============================================================

DO $$
DECLARE
  v_table text;
  v_count int := 0;
BEGIN
  FOREACH v_table IN ARRAY ARRAY['categorias', 'productos', 'imagenes_productos', 'puntos_entrega', 'contactos', 'configuracion_sitio', 'generos', 'marcas']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE information_schema.tables.table_name = v_table) THEN
      v_count := v_count + 1;
      RAISE NOTICE '✓ Tabla verificada: %', v_table;
    ELSE
      RAISE NOTICE '✗ Tabla faltante: %', v_table;
    END IF;
  END LOOP;
  RAISE NOTICE 'Total de tablas verificadas: %', v_count;
END $$;

DO $$
DECLARE
  productos_count int;
  productos_con_genero int;
  productos_con_marca int;
BEGIN
  SELECT COUNT(*) INTO productos_count FROM productos;
  SELECT COUNT(*) INTO productos_con_genero FROM productos WHERE genero_id IS NOT NULL;
  SELECT COUNT(*) INTO productos_con_marca FROM productos WHERE marca_id IS NOT NULL;

  RAISE NOTICE 'Total de productos: %', productos_count;
  RAISE NOTICE 'Productos con género migrado: %', productos_con_genero;
  RAISE NOTICE 'Productos con marca migrada: %', productos_con_marca;
END $$;

DO $$
DECLARE
  v_column text;
BEGIN
  FOREACH v_column IN ARRAY ARRAY['nombre', 'descripcion_corta', 'descripcion_completa', 'precio', 'porcentaje_descuento', 'precio_final', 'url_imagen', 'categoria_id', 'genero_id', 'marca_id', 'es_nuevo', 'es_activo', 'esta_disponible', 'orden_ordenamiento', 'fecha_creacion', 'fecha_actualizacion']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'productos' AND column_name = v_column) THEN
      RAISE NOTICE '✓ Columna verificada en productos: %', v_column;
    ELSE
      RAISE NOTICE '✗ Columna faltante en productos: %', v_column;
    END IF;
  END LOOP;
END $$;

COMMIT;

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================

-- NO CORRER ES SOLO LA MIGRACION