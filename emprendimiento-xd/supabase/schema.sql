-- ============================================================
-- GLOWSPOT · Schema de base de datos (ESPAÑOL)
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- 1. GÉNEROS (Unisex, Para Él, Para Ella, Niños)
-- ------------------------------------------------------------
create table if not exists generos (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  slug               text not null unique,
  descripcion        text,
  orden_ordenamiento int not null default 0,
  es_activo          boolean not null default true,
  fecha_creacion     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. MARCAS (Yanbal, etc.)
-- ------------------------------------------------------------
create table if not exists marcas (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  slug               text not null unique,
  descripcion        text,
  orden_ordenamiento int not null default 0,
  es_activo          boolean not null default true,
  fecha_creacion     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. CATEGORÍAS DE PRODUCTOS
-- ------------------------------------------------------------
create table if not exists categorias (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  slug               text not null unique,
  descripcion        text,
  orden_ordenamiento int not null default 0,
  es_activo          boolean not null default true,
  fecha_creacion     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. PRODUCTOS
-- ------------------------------------------------------------
create table if not exists productos (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text not null,
  slug                  text not null unique,
  descripcion_corta     text,                    -- resumen corto para la tarjeta
  descripcion_completa  text,                    -- descripción completa en la página de detalle
  marca_id              uuid references marcas(id) on delete set null,
  precio                numeric(10, 2) not null check (precio >= 0),
  porcentaje_descuento  numeric(5, 2) check (porcentaje_descuento >= 0 and porcentaje_descuento <= 100),
  precio_final          numeric(10, 2) check (precio_final >= 0),
  url_imagen            text,                    -- imagen principal / portada
  categoria_id          uuid references categorias(id) on delete set null,
  genero_id             uuid references generos(id) on delete set null,
  stock                 int not null default 0 check (stock >= 0),
  esta_disponible       boolean not null default true,
  es_nuevo              boolean not null default false,
  es_activo             boolean not null default true,
  orden_ordenamiento    int not null default 0,
  fecha_creacion        timestamptz not null default now(),
  fecha_actualizacion   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. IMÁGENES ADICIONALES DEL PRODUCTO
-- ------------------------------------------------------------
create table if not exists imagenes_productos (
  id                 uuid primary key default gen_random_uuid(),
  producto_id        uuid not null references productos(id) on delete cascade,
  url_imagen         text not null,
  texto_alternativo  text,
  orden_ordenamiento int not null default 0,
  es_principal       boolean not null default false,
  fecha_creacion     timestamptz not null default now()
);

create index if not exists idx_imagenes_productos_producto on imagenes_productos(producto_id);

-- ------------------------------------------------------------
-- 6. PUNTOS DE ENTREGA
-- ------------------------------------------------------------
create table if not exists puntos_entrega (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  slug               text not null unique,
  descripcion        text,
  orden_ordenamiento int not null default 0,
  es_activo          boolean not null default true,
  fecha_creacion     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. CONTACTOS (pueden ser varios: WhatsApp, email, teléfono...)
-- ------------------------------------------------------------
create table if not exists contactos (
  id                 uuid primary key default gen_random_uuid(),
  tipo               text not null check (tipo in ('whatsapp', 'email', 'phone', 'other')),
  etiqueta           text not null,               -- ej: "Ventas", "Soporte", "WhatsApp principal"
  valor              text not null,               -- número, email o enlace
  orden_ordenamiento int not null default 0,
  es_activo          boolean not null default true,
  fecha_creacion     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. CONFIGURACIÓN DEL SITIO (una sola fila)
-- ------------------------------------------------------------
create table if not exists configuracion_sitio (
  id                      int primary key default 1 check (id = 1),
  nombre_empresa          text not null default 'GLOWSPOT',
  url_logo                text,
  insignia_hero           text,
  titulo_hero             text,
  descripcion_hero        text,
  url_imagen_hero         text,
  nota_envio              text,
  nota_audiencia           text,
  pasos                   jsonb not null default '[]'::jsonb,
  ubicacion_contacto      text,                -- dirección general del negocio
  descripcion_pie_pagina  text,
  fecha_actualizacion     timestamptz not null default now()
);

-- Índices de productos
create index if not exists idx_productos_categoria   on productos(categoria_id);
create index if not exists idx_productos_genero      on productos(genero_id);
create index if not exists idx_productos_marca       on productos(marca_id);
create index if not exists idx_productos_es_activo   on productos(es_activo);
create index if not exists idx_productos_es_nuevo    on productos(es_nuevo);
create index if not exists idx_productos_nombre_trgm on productos using gin (nombre gin_trgm_ops);

-- Función para calcular precio_final automáticamente
create or replace function calcular_precio_final()
returns trigger as $$
begin
  if new.porcentaje_descuento is not null and new.porcentaje_descuento > 0 then
    new.precio_final = new.precio * (1 - new.porcentaje_descuento / 100);
  else
    new.precio_final = new.precio;
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger para calcular precio_final
create trigger update_precio_final
  before insert or update of precio, porcentaje_descuento on productos
  for each row execute function calcular_precio_final();

-- Auto-actualizar fecha_actualizacion en productos
create or replace function set_fecha_actualizacion()
returns trigger as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists productos_actualizacion on productos;
create trigger productos_actualizacion
  before update on productos
  for each row execute function set_fecha_actualizacion();

-- ------------------------------------------------------------
-- STORAGE · Crear bucket "products" en Supabase Storage (público)
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table generos            enable row level security;
alter table marcas              enable row level security;
alter table categorias          enable row level security;
alter table productos          enable row level security;
alter table imagenes_productos enable row level security;
alter table puntos_entrega      enable row level security;
alter table contactos           enable row level security;
alter table configuracion_sitio enable row level security;

drop policy if exists "Géneros visibles para todos"          on generos;
drop policy if exists "Marcas visibles para todos"             on marcas;
drop policy if exists "Categorías visibles para todos"        on categorias;
drop policy if exists "Productos activos visibles"            on productos;
drop policy if exists "Imágenes de productos visibles"        on imagenes_productos;
drop policy if exists "Puntos de entrega visibles"            on puntos_entrega;
drop policy if exists "Contactos visibles"                    on contactos;
drop policy if exists "Configuración del sitio visible"       on configuracion_sitio;

create policy "Géneros visibles para todos"
  on generos for select using (es_activo = true);

create policy "Marcas visibles para todos"
  on marcas for select using (es_activo = true);

create policy "Categorías visibles para todos"
  on categorias for select using (es_activo = true);

create policy "Productos activos visibles"
  on productos for select using (es_activo = true);

create policy "Imágenes de productos visibles"
  on imagenes_productos for select
  using (
    exists (
      select 1 from productos
      where productos.id = imagenes_productos.producto_id
        and productos.es_activo = true
    )
  );

create policy "Puntos de entrega visibles"
  on puntos_entrega for select using (es_activo = true);

create policy "Contactos visibles"
  on contactos for select using (es_activo = true);

create policy "Configuración del sitio visible"
  on configuracion_sitio for select using (true);

