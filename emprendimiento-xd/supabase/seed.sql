-- ============================================================
-- GLOWSPOT · Datos iniciales de ejemplo (ESPAÑOL)
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- Géneros
insert into generos (nombre, slug, descripcion, orden_ordenamiento) values
  ('Unisex',        'unisex',        'Productos para todos', 1),
  ('Para Él',       'para-el',       'Cuidado masculino',    2),
  ('Para Ella',     'para-ella',     'Cuidado femenino',    3),
  ('Niños',         'ninos',         'Productos infantiles', 4)
on conflict (slug) do nothing;

-- Marcas
insert into marcas (nombre, slug, descripcion, orden_ordenamiento) values
  ('Yanbal',        'yanbal',        'Productos Yanbal', 1),
  ('Yanbal Skin Expert', 'yanbal-skin-expert', 'Línea skincare', 2),
  ('Yanbal Fragancias', 'yanbal-fragancias', 'Línea de fragancias', 3),
  ('Yanbal Kids',   'yanbal-kids',   'Línea infantil', 4)
on conflict (slug) do nothing;

-- Categorías
insert into categorias (nombre, slug, descripcion, orden_ordenamiento) values
  ('Cuidado de la Piel',  'cuidado-de-la-piel',  'Sérums, cremas y tratamientos faciales', 1),
  ('Cuidado Masculino',   'cuidado-masculino',   'Línea de cuidado personal para él',       2),
  ('Perfumes',            'perfumes',            'Fragancias y eau de parfum',              3),
  ('Línea Niños',         'linea-ninos',         'Productos suaves para los más peques',    4),
  ('Protección Solar',    'proteccion-solar',    'Protectores solares y after sun',         5)
on conflict (slug) do nothing;

-- Productos con descripción corta y completa
insert into productos (
  nombre, slug, descripcion_corta, descripcion_completa, marca_id, precio, categoria_id, genero_id, es_nuevo, stock
) values
  (
    'Sérum Facial Renovador',
    'serum-facial-renovador',
    'Sérum concentrado que renueva y revitaliza la piel.',
    'El Sérum Facial Renovador de Yanbal Skin Expert está formulado con activos de alta concentración que ayudan a renovar la piel, reducir líneas de expresión y devolver luminosidad. Ideal para uso diario, mañana y noche. Apto para todo tipo de piel.',
    (select id from marcas where slug = 'yanbal-skin-expert'),
    189.00,
    (select id from categorias where slug = 'cuidado-de-la-piel'),
    (select id from generos where slug = 'unisex'),
    true,
    20
  ),
  (
    'Colonia Infantil Suave',
    'colonia-infantil-suave',
    'Colonia delicada formulada especialmente para niños.',
    'Colonia Infantil Suave de la línea Yanbal Kids. Fragancia ligera y fresca, dermatológicamente testeada, sin alcohol agresivo. Perfecta para el cuidado diario de los más pequeños de la casa.',
    (select id from marcas where slug = 'yanbal-kids'),
    78.00,
    (select id from categorias where slug = 'linea-ninos'),
    (select id from generos where slug = 'ninos'),
    true,
    15
  ),
  (
    'Eau de Parfum Floral',
    'eau-de-parfum-floral',
    'Fragancia floral elegante de larga duración.',
    'Eau de Parfum Floral de Yanbal Fragancias. Notas florales sofisticadas con excelente fijación. Una fragancia versátil para el día a día o ocasiones especiales. Presentación elegante ideal para regalo.',
    (select id from marcas where slug = 'yanbal-fragancias'),
    320.00,
    (select id from categorias where slug = 'perfumes'),
    (select id from generos where slug = 'para-ella'),
    true,
    10
  )
on conflict (slug) do nothing;

-- Imágenes adicionales de productos (galería)
-- Nota: reemplaza las URLs cuando subas imágenes reales a Supabase Storage
insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento, es_principal)
select p.id, 'https://placehold.co/600x600?text=Serum+1', 'Sérum Facial Renovador - vista frontal', 1, true
from productos p where p.slug = 'serum-facial-renovador';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento)
select p.id, 'https://placehold.co/600x600?text=Serum+2', 'Sérum Facial Renovador - aplicación', 2
from productos p where p.slug = 'serum-facial-renovador';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento)
select p.id, 'https://placehold.co/600x600?text=Serum+3', 'Sérum Facial Renovador - ingredientes', 3
from productos p where p.slug = 'serum-facial-renovador';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento, es_principal)
select p.id, 'https://placehold.co/600x600?text=Colonia+1', 'Colonia Infantil Suave - vista frontal', 1, true
from productos p where p.slug = 'colonia-infantil-suave';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento)
select p.id, 'https://placehold.co/600x600?text=Colonia+2', 'Colonia Infantil Suave - empaque', 2
from productos p where p.slug = 'colonia-infantil-suave';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento, es_principal)
select p.id, 'https://placehold.co/600x600?text=Perfume+1', 'Eau de Parfum Floral - vista frontal', 1, true
from productos p where p.slug = 'eau-de-parfum-floral';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento)
select p.id, 'https://placehold.co/600x600?text=Perfume+2', 'Eau de Parfum Floral - frasco', 2
from productos p where p.slug = 'eau-de-parfum-floral';

insert into imagenes_productos (producto_id, url_imagen, texto_alternativo, orden_ordenamiento)
select p.id, 'https://placehold.co/600x600?text=Perfume+3', 'Eau de Parfum Floral - detalle', 3
from productos p where p.slug = 'eau-de-parfum-floral';

-- Puntos de entrega
insert into puntos_entrega (nombre, slug, orden_ordenamiento) values
  ('Universidad Mayor de San Simón', 'umss',          1),
  ('Plaza Sucre',                    'plaza-sucre',   2),
  ('Plaza 14 de Septiembre',         'plaza-14-sept', 3),
  ('Correo',                         'correo',        4),
  ('Punata',                         'punata',        5)
on conflict (slug) do nothing;

-- Contactos (puedes agregar tantos como necesites)
insert into contactos (tipo, etiqueta, valor, orden_ordenamiento) values
  ('whatsapp', 'WhatsApp Ventas',    '+591 74307669',      1),
  ('whatsapp', 'WhatsApp Soporte',   '+591 70000001',      2),
  ('email',    'Correo principal',   'hola@glowspot.com',  3),
  ('email',    'Pedidos',            'pedidos@glowspot.com', 4),
  ('phone',    'Teléfono',           '+591 74307669',      5)
on conflict do nothing;

-- Configuración del sitio
insert into configuracion_sitio (
  nombre_empresa,
  insignia_hero,
  titulo_hero,
  descripcion_hero,
  nota_envio,
  nota_audiencia,
  pasos,
  ubicacion_contacto,
  descripcion_pie_pagina
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
  nombre_empresa          = excluded.nombre_empresa,
  insignia_hero           = excluded.insignia_hero,
  titulo_hero             = excluded.titulo_hero,
  descripcion_hero        = excluded.descripcion_hero,
  nota_envio              = excluded.nota_envio,
  nota_audiencia           = excluded.nota_audiencia,
  pasos                   = excluded.pasos,
  ubicacion_contacto      = excluded.ubicacion_contacto,
  descripcion_pie_pagina  = excluded.descripcion_pie_pagina,
  fecha_actualizacion     = now();
