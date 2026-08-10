-- ============================================================
-- GLOWSPOT · Datos iniciales de ejemplo
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- Categorías
insert into categories (name, slug, description, sort_order) values
  ('Cuidado de la Piel',  'cuidado-de-la-piel',  'Sérums, cremas y tratamientos faciales', 1),
  ('Cuidado Masculino',   'cuidado-masculino',   'Línea de cuidado personal para él',       2),
  ('Perfumes',            'perfumes',            'Fragancias y eau de parfum',              3),
  ('Línea Niños',         'linea-ninos',         'Productos suaves para los más peques',    4),
  ('Protección Solar',    'proteccion-solar',    'Protectores solares y after sun',         5)
on conflict (slug) do nothing;

-- Productos con descripción corta y completa
insert into products (
  name, slug, short_description, description, brand_line, price, category_id, is_new, stock
) values
  (
    'Sérum Facial Renovador',
    'serum-facial-renovador',
    'Sérum concentrado que renueva y revitaliza la piel.',
    'El Sérum Facial Renovador de Yanbal Skin Expert está formulado con activos de alta concentración que ayudan a renovar la piel, reducir líneas de expresión y devolver luminosidad. Ideal para uso diario, mañana y noche. Apto para todo tipo de piel.',
    'YANBAL · SKIN EXPERT',
    189.00,
    (select id from categories where slug = 'cuidado-de-la-piel'),
    true,
    20
  ),
  (
    'Colonia Infantil Suave',
    'colonia-infantil-suave',
    'Colonia delicada formulada especialmente para niños.',
    'Colonia Infantil Suave de la línea Yanbal Kids. Fragancia ligera y fresca, dermatológicamente testeada, sin alcohol agresivo. Perfecta para el cuidado diario de los más pequeños de la casa.',
    'YANBAL · KIDS',
    78.00,
    (select id from categories where slug = 'linea-ninos'),
    true,
    15
  ),
  (
    'Eau de Parfum Floral',
    'eau-de-parfum-floral',
    'Fragancia floral elegante de larga duración.',
    'Eau de Parfum Floral de Yanbal Fragrancias. Notas florales sofisticadas con excelente fijación. Una fragancia versátil para el día a día o ocasiones especiales. Presentación elegante ideal para regalo.',
    'YANBAL · FRAGANCIAS',
    320.00,
    (select id from categories where slug = 'perfumes'),
    true,
    10
  )
on conflict (slug) do nothing;

-- Imágenes adicionales de productos (galería)
-- Nota: reemplaza las URLs cuando subas imágenes reales a Supabase Storage
insert into product_images (product_id, image_url, alt_text, sort_order, is_primary)
select p.id, 'https://placehold.co/600x600?text=Serum+1', 'Sérum Facial Renovador - vista frontal', 1, true
from products p where p.slug = 'serum-facial-renovador';

insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600?text=Serum+2', 'Sérum Facial Renovador - aplicación', 2
from products p where p.slug = 'serum-facial-renovador';

insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600?text=Serum+3', 'Sérum Facial Renovador - ingredientes', 3
from products p where p.slug = 'serum-facial-renovador';

insert into product_images (product_id, image_url, alt_text, sort_order, is_primary)
select p.id, 'https://placehold.co/600x600?text=Colonia+1', 'Colonia Infantil Suave - vista frontal', 1, true
from products p where p.slug = 'colonia-infantil-suave';

insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600?text=Colonia+2', 'Colonia Infantil Suave - empaque', 2
from products p where p.slug = 'colonia-infantil-suave';

insert into product_images (product_id, image_url, alt_text, sort_order, is_primary)
select p.id, 'https://placehold.co/600x600?text=Perfume+1', 'Eau de Parfum Floral - vista frontal', 1, true
from products p where p.slug = 'eau-de-parfum-floral';

insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600?text=Perfume+2', 'Eau de Parfum Floral - frasco', 2
from products p where p.slug = 'eau-de-parfum-floral';

insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600?text=Perfume+3', 'Eau de Parfum Floral - detalle', 3
from products p where p.slug = 'eau-de-parfum-floral';

-- Puntos de entrega
insert into delivery_points (name, slug, sort_order) values
  ('Universidad Mayor de San Simón', 'umss',          1),
  ('Plaza Sucre',                    'plaza-sucre',   2),
  ('Plaza 14 de Septiembre',         'plaza-14-sept', 3),
  ('Correo',                         'correo',        4),
  ('Punata',                         'punata',        5)
on conflict (slug) do nothing;

-- Contactos (puedes agregar tantos como necesites)
insert into contacts (type, label, value, sort_order) values
  ('whatsapp', 'WhatsApp Ventas',    '+591 74307669',      1),
  ('whatsapp', 'WhatsApp Soporte',   '+591 70000001',      2),
  ('email',    'Correo principal',   'hola@glowspot.com',  3),
  ('email',    'Pedidos',            'pedidos@glowspot.com', 4),
  ('phone',    'Teléfono',           '+591 74307669',      5)
on conflict do nothing;

-- Configuración del sitio
insert into site_config (
  company_name,
  hero_badge,
  hero_title,
  hero_description,
  shipping_note,
  audience_note,
  steps,
  contact_location,
  footer_description
) values (
  'GLOWSPOT',
  'PIDE HOY · RECOGE EN TU PUNTO',
  'Tu belleza, más cerca que nunca',
  'Skincare, perfumes, cuidado masculino y línea infantil. Arma tu pedido en línea y recógelo en el punto GLOWSPOT de Arani.',
  '0 Bs. costo de envío',
  'Todos: ellas, ellos y peques',
  '[
    {"step": 1, "title": "Elige en línea", "description": "Arma tu pedido con productos para toda la familia, sin salir de casa."},
    {"step": 2, "title": "Confirma por WhatsApp", "description": "Te enviamos el resumen y coordinamos el punto y horario de recojo."},
    {"step": 3, "title": "Recoge en tu GlowSpot", "description": "Pasa por el punto que elijas en Arani. Sin costos de envío sorpresa."}
  ]'::jsonb,
  'Arani, Cochabamba · Bolivia',
  'Distribuidor independiente de productos Yanbal en Arani, Cochabamba. Belleza y cuidado personal para ellas, ellos y los más peques, con recojo en puntos GlowSpot.'
)
on conflict (id) do update set
  company_name       = excluded.company_name,
  hero_badge         = excluded.hero_badge,
  hero_title         = excluded.hero_title,
  hero_description   = excluded.hero_description,
  shipping_note      = excluded.shipping_note,
  audience_note      = excluded.audience_note,
  steps              = excluded.steps,
  contact_location   = excluded.contact_location,
  footer_description = excluded.footer_description,
  updated_at         = now();
