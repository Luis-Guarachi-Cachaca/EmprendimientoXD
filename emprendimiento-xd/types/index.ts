export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden_ordenamiento: number;
  es_activo: boolean;
  fecha_creacion?: string;
}

export interface ImagenProducto {
  id: string;
  producto_id: string;
  url_imagen: string;
  texto_alternativo: string | null;
  orden_ordenamiento: number;
  es_principal: boolean;
  fecha_creacion?: string;
}

export interface Genero {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden_ordenamiento: number;
  es_activo: boolean;
  fecha_creacion?: string;
}

export interface Marca {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden_ordenamiento: number;
  es_activo: boolean;
  fecha_creacion?: string;
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  descripcion_completa: string | null;
  marca_id: string | null;
  precio: number;
  porcentaje_descuento: number | null;
  precio_final: number | null;
  url_imagen: string | null;
  categoria_id: string | null;
  genero_id: string | null;
  stock: number;
  esta_disponible: boolean;
  es_nuevo: boolean;
  es_activo: boolean;
  orden_ordenamiento: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  imagenes?: ImagenProducto[];
  // Campos relacionales para conveniencia (opcional)
  categoria?: Categoria;
  genero?: Genero;
  marca?: Marca;
  // Campos de contenido
  contenido: number | null;
  unidad_medida: 'ml' | 'g' | 'kg' | 'l' | 'unidad' | null;
}

export interface PuntoEntrega {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden_ordenamiento: number;
  es_activo: boolean;
  fecha_creacion?: string;
}

export type TipoContacto = "whatsapp" | "email" | "phone" | "other";

export interface Contacto {
  id: string;
  tipo: TipoContacto;
  etiqueta: string;
  valor: string;
  orden_ordenamiento: number;
  es_activo: boolean;
  fecha_creacion?: string;
}

export interface SiteStep {
  step: number;
  title: string;
  description: string;
}

export interface ConfiguracionSitio {
  id: number;
  nombre_empresa: string;
  url_logo: string | null;
  insignia_hero: string | null;
  titulo_hero: string | null;
  descripcion_hero: string | null;
  url_imagen_hero: string | null;
  nota_envio: string | null;
  nota_audiencia: string | null;
  pasos: SiteStep[];
  ubicacion_contacto: string | null;
  descripcion_pie_pagina: string | null;
  fecha_actualizacion?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
