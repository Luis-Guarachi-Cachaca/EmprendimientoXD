import type {
  Categoria,
  Contacto,
  PuntoEntrega,
  Producto,
  ConfiguracionSitio,
  Genero,
  Marca,
} from "@/types";
import { supabase } from "./client";

export async function getProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento")
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function getProductoPorSlug(slug: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*, imagenes_productos(*), categorias(*), generos(*), marcas(*)")
    .eq("slug", slug)
    .eq("es_activo", true)
    .order("orden_ordenamiento", { referencedTable: "imagenes_productos" })
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const { imagenes_productos, categorias, generos, marcas, ...producto } = data;
  return {
    ...producto,
    imagenes: imagenes_productos ?? [],
    categoria: categorias ?? undefined,
    genero: generos ?? undefined,
    marca: marcas ?? undefined,
  };
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento");

  if (error) throw error;
  return data ?? [];
}

export async function getProductosPorCategoria(
  categorySlug: string
): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*, categorias!inner(slug)")
    .eq("es_activo", true)
    .eq("categorias.slug", categorySlug)
    .order("orden_ordenamiento")
    .order("nombre");

  if (error) throw error;
  return (data ?? []).map(({ categorias: _, ...producto }) => producto as Producto);
}

export async function getProductosNuevos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("es_activo", true)
    .eq("es_nuevo", true)
    .order("orden_ordenamiento")
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function buscarProductos(query: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("es_activo", true)
    .or(`nombre.ilike.%${query}%,descripcion_corta.ilike.%${query}%`)
    .order("nombre");

  if (error) throw error;
  return data ?? [];
}

export async function getPuntosEntrega(): Promise<PuntoEntrega[]> {
  const { data, error } = await supabase
    .from("puntos_entrega")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento");

  if (error) throw error;
  return data ?? [];
}

export async function getContactos(): Promise<Contacto[]> {
  const { data, error } = await supabase
    .from("contactos")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento");

  if (error) throw error;
  return data ?? [];
}

export async function getConfiguracionSitio(): Promise<ConfiguracionSitio | null> {
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
}

export async function getGeneros(): Promise<Genero[]> {
  const { data, error } = await supabase
    .from("generos")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento");

  if (error) throw error;
  return data ?? [];
}

export async function getMarcas(): Promise<Marca[]> {
  const { data, error } = await supabase
    .from("marcas")
    .select("*")
    .eq("es_activo", true)
    .order("orden_ordenamiento");

  if (error) throw error;
  return data ?? [];
}
