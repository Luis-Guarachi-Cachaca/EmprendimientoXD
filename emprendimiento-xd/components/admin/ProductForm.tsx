"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Save, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { compressImage, uploadImageToSupabase } from "@/lib/utils/imageCompression";
import type { Producto, Genero, Marca } from "@/types";

interface ProductFormProps {
  producto?: Producto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  nombre: string;
  slug: string;
  descripcion_corta: string;
  descripcion_completa: string;
  marca_id: string;
  precio: string;
  porcentaje_descuento: string;
  categoria_id: string;
  stock: string;
  esta_disponible: boolean;
  es_nuevo: boolean;
  es_activo: boolean;
  genero_id: string;
  image_file: File | null;
  url_imagen: string;
  contenido: string;
  unidad_medida: string;
}

export function ProductForm({ producto, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: producto?.nombre || "",
    slug: producto?.slug || "",
    descripcion_corta: producto?.descripcion_corta || "",
    descripcion_completa: producto?.descripcion_completa || "",
    marca_id: producto?.marca_id || "",
    precio: producto?.precio?.toString() || "",
    porcentaje_descuento: producto?.porcentaje_descuento?.toString() || "0",
    categoria_id: producto?.categoria_id || "",
    stock: producto?.stock?.toString() || "0",
    esta_disponible: producto?.esta_disponible ?? true,
    es_nuevo: producto?.es_nuevo || false,
    es_activo: producto?.es_activo ?? true,
    genero_id: producto?.genero_id || "",
    image_file: null,
    url_imagen: producto?.url_imagen || "",
    contenido: producto?.contenido?.toString() || "",
    unidad_medida: producto?.unidad_medida || "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(producto?.url_imagen || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchGeneros();
    fetchMarcas();
  }, []);

  const fetchGeneros = async () => {
    const { data, error } = await supabase
      .from("generos")
      .select("*")
      .eq("es_activo", true)
      .order("orden_ordenamiento");

    if (error) {
      console.error("Error fetching generos:", error);
    } else {
      setGeneros(data || []);
    }
  };

  const fetchMarcas = async () => {
    const { data, error } = await supabase
      .from("marcas")
      .select("*")
      .eq("es_activo", true)
      .order("orden_ordenamiento");

    if (error) {
      console.error("Error fetching marcas:", error);
    } else {
      setMarcas(data || []);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("es_activo", true)
      .order("orden_ordenamiento");

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Auto-generate slug when name changes
      if (name === "nombre") {
        setFormData((prev) => ({
          ...prev,
          slug: generateSlug(value),
        }));
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    // Validar tamaño (máximo 5MB antes de compresión)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es muy grande (máximo 5MB)");
      return;
    }

    setFormData((prev) => ({ ...prev, image_file: file }));
    setError(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("📝 Iniciando guardado de producto...");
      console.log("Datos del formulario:", formData);

      // Validaciones
      if (!formData.nombre.trim()) {
        throw new Error("El nombre es requerido");
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        throw new Error("El precio debe ser mayor a 0");
      }
      if (!formData.categoria_id) {
        throw new Error("La categoría es requerida");
      }

      let finalImageUrl = formData.url_imagen;

      // Subir nueva imagen si existe
      if (formData.image_file) {
        console.log("🖼️ Subiendo imagen...");
        setUploadingImage(true);
        try {
          const compressed = await compressImage(formData.image_file);
          const fileName = `${Date.now()}-${formData.slug}.webp`;
          finalImageUrl = await uploadImageToSupabase(compressed.file, "products", fileName);
          console.log("✅ Imagen subida:", finalImageUrl);
        } catch (err) {
          console.error("❌ Error al subir imagen:", err);
          throw new Error("Error al subir la imagen");
        } finally {
          setUploadingImage(false);
        }
      }

      const productData = {
        nombre: formData.nombre,
        slug: formData.slug,
        descripcion_corta: formData.descripcion_corta || null,
        descripcion_completa: formData.descripcion_completa || null,
        marca_id: formData.marca_id || null,
        precio: parseFloat(formData.precio),
        porcentaje_descuento: parseFloat(formData.porcentaje_descuento) || 0,
        url_imagen: finalImageUrl || null,
        categoria_id: formData.categoria_id || null,
        genero_id: formData.genero_id || null,
        stock: parseInt(formData.stock) || 0,
        esta_disponible: formData.esta_disponible,
        es_nuevo: formData.es_nuevo,
        es_activo: formData.es_activo,
        orden_ordenamiento: producto?.orden_ordenamiento || 0,
        contenido: formData.contenido ? parseFloat(formData.contenido) : null,
        unidad_medida: formData.unidad_medida || null,
      };

      console.log("💾 Guardando producto vía API:", productData);

      let response;

      if (producto?.id) {
        // Actualizar producto existente
        console.log("🔄 Actualizando producto existente:", producto.id);
        response = await fetch(`/api/admin/productos/${producto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // Crear nuevo producto
        console.log("➕ Creando nuevo producto");
        response = await fetch('/api/admin/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error de API:", errorData);
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      console.log("✅ Producto guardado exitosamente");
      onSuccess?.();
    } catch (err) {
      console.error("❌ Error en handleSubmit:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2B4C7E]">
          {producto?.id ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-[#6B7280]" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-[#1E2229] mb-2">
            Imagen del Producto
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging
                ? "border-[#2B4C7E] bg-[#EBF1F5]"
                : "border-gray-300 hover:border-[#2B4C7E]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image_file: null }));
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">
                  Arrastra una imagen o haz click para seleccionar
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  JPG, PNG, WebP, JFIF, GIF, BMP (máximo 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/jfif,image/gif,image/bmp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>
          {uploadingImage && (
            <p className="text-sm text-[#2B4C7E] mt-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Comprimiendo y subiendo imagen...
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Ej: Sérum Facial Renovador"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Slug (URL amigable)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent bg-gray-50"
            placeholder="ej: serum-facial-renovador"
          />
        </div>

        {/* Descripción Corta */}
        <div>
          <label htmlFor="descripcion_corta" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Descripción Corta
          </label>
          <textarea
            id="descripcion_corta"
            name="descripcion_corta"
            value={formData.descripcion_corta}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Descripción breve para la card del producto"
          />
        </div>

        {/* Descripción Larga */}
        <div>
          <label htmlFor="descripcion_completa" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Descripción Completa
          </label>
          <textarea
            id="descripcion_completa"
            name="descripcion_completa"
            value={formData.descripcion_completa}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Descripción detallada del producto"
          />
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="marca_id" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Marca
          </label>
          <select
            id="marca_id"
            name="marca_id"
            value={formData.marca_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
          >
            <option value="">Sin marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Contenido y Unidad de Medida */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contenido" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Contenido (cantidad/peso/volumen)
            </label>
            <input
              type="number"
              id="contenido"
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
              placeholder="Ej: 150"
            />
          </div>
          <div>
            <label htmlFor="unidad_medida" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Unidad de Medida
            </label>
            <select
              id="unidad_medida"
              name="unidad_medida"
              value={formData.unidad_medida}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            >
              <option value="">Sin unidad</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="g">Gramos (g)</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="l">Litros (l)</option>
              <option value="unidad">Unidad</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Precio (Bs.) *
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Descuento */}
          <div>
            <label htmlFor="porcentaje_descuento" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              id="porcentaje_descuento"
              name="porcentaje_descuento"
              value={formData.porcentaje_descuento}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categoría */}
          <div>
            <label htmlFor="categoria_id" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Categoría *
            </label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Género */}
        <div>
          <label htmlFor="genero_id" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Género
          </label>
          <select
            id="genero_id"
            name="genero_id"
            value={formData.genero_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
          >
            <option value="">Sin especificar</option>
            {generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="esta_disponible"
              checked={formData.esta_disponible}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#2B4C7E] rounded focus:ring-[#2B4C7E]"
            />
            <span className="text-sm text-[#1E2229]">Disponible</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="es_nuevo"
              checked={formData.es_nuevo}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#2B4C7E] rounded focus:ring-[#2B4C7E]"
            />
            <span className="text-sm text-[#1E2229]">Producto Nuevo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="es_activo"
              checked={formData.es_activo}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#2B4C7E] rounded focus:ring-[#2B4C7E]"
            />
            <span className="text-sm text-[#1E2229]">Activo</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 bg-[#2B4C7E] text-white py-3 rounded-lg font-semibold hover:bg-[#1E3A5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {producto?.id ? "Actualizar" : "Crear"} Producto
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-[#1E2229] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
