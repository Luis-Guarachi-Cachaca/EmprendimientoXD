"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Save, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { compressImage, uploadImageToSupabase } from "@/lib/utils/imageCompression";
import type { Product, Gender } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  brand_line: string;
  price: string;
  discount_percentage: string;
  category_id: string;
  stock: string;
  is_available: boolean;
  is_new: boolean;
  is_active: boolean;
  gender: Gender | "";
  image_file: File | null;
  image_url: string;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    short_description: product?.short_description || "",
    description: product?.description || "",
    brand_line: product?.brand_line || "",
    price: product?.price?.toString() || "",
    discount_percentage: product?.discount_percentage?.toString() || "0",
    category_id: product?.category_id || "",
    stock: product?.stock?.toString() || "0",
    is_available: product?.is_available ?? true,
    is_new: product?.is_new || false,
    is_active: product?.is_active ?? true,
    gender: product?.gender || "",
    image_file: null,
    image_url: product?.image_url || "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product?.image_url || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

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
      if (name === "name") {
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
      if (!formData.name.trim()) {
        throw new Error("El nombre es requerido");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("El precio debe ser mayor a 0");
      }
      if (!formData.category_id) {
        throw new Error("La categoría es requerida");
      }

      let finalImageUrl = formData.image_url;

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
        name: formData.name,
        slug: formData.slug,
        short_description: formData.short_description || null,
        description: formData.description || null,
        brand_line: formData.brand_line || null,
        price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        image_url: finalImageUrl || null,
        category_id: formData.category_id || null,
        stock: parseInt(formData.stock) || 0,
        is_available: formData.is_available,
        is_new: formData.is_new,
        is_active: formData.is_active,
        gender: formData.gender || null,
        sort_order: product?.sort_order || 0,
      };

      console.log("💾 Guardando producto en Supabase:", productData);

      let error;

      if (product?.id) {
        // Actualizar producto existente
        console.log("🔄 Actualizando producto existente:", product.id);
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        error = updateError;
      } else {
        // Crear nuevo producto
        console.log("➕ Creando nuevo producto");
        const { error: insertError } = await supabase
          .from("products")
          .insert(productData);
        error = insertError;
      }

      if (error) {
        console.error("❌ Error de Supabase:", error);
        throw new Error(`Error al guardar el producto: ${error.message}`);
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
          {product?.id ? "Editar Producto" : "Nuevo Producto"}
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
          <label htmlFor="name" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="short_description" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Descripción Corta
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Descripción breve para la card del producto"
          />
        </div>

        {/* Descripción Larga */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Descripción Completa
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Descripción detallada del producto"
          />
        </div>

        {/* Línea de Marca */}
        <div>
          <label htmlFor="brand_line" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Línea de Marca
          </label>
          <input
            type="text"
            id="brand_line"
            name="brand_line"
            value={formData.brand_line}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            placeholder="Ej: Yanbal Homme"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Precio (Bs.) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
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
            <label htmlFor="discount_percentage" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              id="discount_percentage"
              name="discount_percentage"
              value={formData.discount_percentage}
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
            <label htmlFor="category_id" className="block text-sm font-semibold text-[#1E2229] mb-2">
              Categoría *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
          <label htmlFor="gender" className="block text-sm font-semibold text-[#1E2229] mb-2">
            Género
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
          >
            <option value="">Sin especificar</option>
            <option value="unisex">Unisex</option>
            <option value="men">Para Él</option>
            <option value="women">Para Ella</option>
            <option value="kids">Niños</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#2B4C7E] rounded focus:ring-[#2B4C7E]"
            />
            <span className="text-sm text-[#1E2229]">Disponible</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#2B4C7E] rounded focus:ring-[#2B4C7E]"
            />
            <span className="text-sm text-[#1E2229]">Producto Nuevo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
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
                {product?.id ? "Actualizar" : "Crear"} Producto
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
