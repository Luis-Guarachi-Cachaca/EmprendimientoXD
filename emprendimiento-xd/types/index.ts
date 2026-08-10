export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  brand_line: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  stock: number;
  is_new: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  images?: ProductImage[];
}

export interface DeliveryPoint {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export type ContactType = "whatsapp" | "email" | "phone" | "other";

export interface Contact {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SiteStep {
  step: number;
  title: string;
  description: string;
}

export interface SiteConfig {
  id: number;
  company_name: string;
  logo_url: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  shipping_note: string | null;
  audience_note: string | null;
  steps: SiteStep[];
  contact_location: string | null;
  footer_description: string | null;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
