import type {
  Category,
  Contact,
  DeliveryPoint,
  Product,
  SiteConfig,
} from "@/types";
import { supabase } from "./client";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .order("sort_order", { referencedTable: "product_images" })
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const { product_images, ...product } = data;
  return {
    ...product,
    images: product_images ?? [],
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories!inner(slug)")
    .eq("is_active", true)
    .eq("categories.slug", categorySlug)
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return (data ?? []).map(({ categories: _, ...product }) => product as Product);
}

export async function getNewProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_new", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getDeliveryPoints(): Promise<DeliveryPoint[]> {
  const { data, error } = await supabase
    .from("delivery_points")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
}
