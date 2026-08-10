-- ============================================================
-- GLOWSPOT · Schema de base de datos
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- 1. CATEGORÍAS DE PRODUCTOS
-- ------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. PRODUCTOS
--    short_description → tarjeta del catálogo
--    description       → página de detalle del producto
--    image_url         → imagen principal (portada en el catálogo)
-- ------------------------------------------------------------
create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  short_description text,                    -- resumen corto para la tarjeta
  description       text,                    -- descripción completa en la página de detalle
  brand_line        text,
  price             numeric(10, 2) not null check (price >= 0),
  image_url         text,                    -- imagen principal / portada
  category_id       uuid references categories(id) on delete set null,
  stock             int not null default 0 check (stock >= 0),
  is_new            boolean not null default false,
  is_active         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. IMÁGENES ADICIONALES DEL PRODUCTO
--    Galería en la página de detalle (/producto/[slug])
-- ------------------------------------------------------------
create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  image_url   text not null,
  alt_text    text,
  sort_order  int not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ------------------------------------------------------------
-- 4. PUNTOS DE ENTREGA
-- ------------------------------------------------------------
create table if not exists delivery_points (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. CONTACTOS (pueden ser varios: WhatsApp, email, teléfono...)
--    Usado en: sección Contacto y footer
-- ------------------------------------------------------------
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('whatsapp', 'email', 'phone', 'other')),
  label       text not null,               -- ej: "Ventas", "Soporte", "WhatsApp principal"
  value       text not null,               -- número, email o enlace
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. CONFIGURACIÓN DEL SITIO (una sola fila)
--    Los contactos individuales van en la tabla "contacts"
-- ------------------------------------------------------------
create table if not exists site_config (
  id                  int primary key default 1 check (id = 1),
  company_name        text not null default 'GLOWSPOT',
  logo_url            text,
  hero_badge          text,
  hero_title          text,
  hero_description    text,
  hero_image_url      text,
  shipping_note       text,
  audience_note       text,
  steps               jsonb not null default '[]'::jsonb,
  contact_location    text,                -- dirección general del negocio
  footer_description  text,
  updated_at          timestamptz not null default now()
);

-- Índices de productos
create index if not exists idx_products_category  on products(category_id);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_products_is_new    on products(is_new);
create index if not exists idx_products_name_trgm on products using gin (name gin_trgm_ops);

-- Auto-actualizar updated_at en productos
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- STORAGE · Crear bucket "products" en Supabase Storage (público)
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table categories      enable row level security;
alter table products        enable row level security;
alter table product_images  enable row level security;
alter table delivery_points enable row level security;
alter table contacts        enable row level security;
alter table site_config     enable row level security;

drop policy if exists "Categorías visibles para todos"   on categories;
drop policy if exists "Productos activos visibles"       on products;
drop policy if exists "Imágenes de productos visibles"   on product_images;
drop policy if exists "Puntos de entrega visibles"       on delivery_points;
drop policy if exists "Contactos visibles"               on contacts;
drop policy if exists "Configuración del sitio visible"  on site_config;

create policy "Categorías visibles para todos"
  on categories for select using (is_active = true);

create policy "Productos activos visibles"
  on products for select using (is_active = true);

create policy "Imágenes de productos visibles"
  on product_images for select
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

create policy "Puntos de entrega visibles"
  on delivery_points for select using (is_active = true);

create policy "Contactos visibles"
  on contacts for select using (is_active = true);

create policy "Configuración del sitio visible"
  on site_config for select using (true);
