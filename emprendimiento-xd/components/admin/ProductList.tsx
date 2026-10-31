"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Producto, Categoria } from "@/types";
import { ProductForm } from "./ProductForm";

export function ProductList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  // Búsqueda por texto + filtro por categoría (se combinan)
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchBusqueda =
        !searchTerm ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.marca && p.marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategoria = !selectedCategoria || p.categoria_id === selectedCategoria;

      return matchBusqueda && matchCategoria;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategoria, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(nombre), marcas(nombre), generos(nombre)")
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Todas las categorías (incluidas las que se ocultan en el sitio público),
  // para poder encontrar cualquier producto desde el admin.
  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("orden_ordenamiento");

    if (error) {
      console.error("Error fetching categorias:", error);
    } else {
      setCategorias(data || []);
    }
  };

  const getCategoriaNombre = (categoriaId: string | null) =>
    categorias.find((c) => c.id === categoriaId)?.nombre;

  const handleCreate = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEdit = (product: Producto) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Error al eliminar producto");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProductForm
          producto={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#2B4C7E]">Productos</h1>
        <button
          onClick={handleCreate}
          className="bg-[#2B4C7E] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1E3A5F] transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Buscar por nombre o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
        />
      </div>

      {/* Filtro por categoría */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2B4C7E] mr-1">
            <Tag className="w-4 h-4" />
            Categoría
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategoria(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategoria === null
                ? "bg-[#2B4C7E] text-white border-[#2B4C7E]"
                : "bg-white text-[#1E2229] border-gray-300 hover:border-[#2B4C7E] hover:text-[#2B4C7E]"
            }`}
          >
            Todas
          </button>

          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => setSelectedCategoria(categoria.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategoria === categoria.id
                  ? "bg-[#2B4C7E] text-white border-[#2B4C7E]"
                  : "bg-white text-[#1E2229] border-gray-300 hover:border-[#2B4C7E] hover:text-[#2B4C7E]"
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#2B4C7E] animate-spin" />
        </div>
      ) : (
        <>
          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280]">
              {searchTerm || selectedCategoria ? (
                <p>No se encontraron productos con la búsqueda o la categoría seleccionada.</p>
              ) : (
                <p>No hay productos. Crea el primero para comenzar.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square bg-[#EBF1F5] relative">
                    {product.url_imagen ? (
                      <img
                        src={product.url_imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#2B4C7E]/50">
                        <span className="text-sm">Sin imagen</span>
                      </div>
                    )}
                    {product.es_nuevo && (
                      <span className="absolute top-2 left-2 bg-[#FF7B54] text-white text-xs font-bold px-2 py-1 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-[#1E2229] line-clamp-1">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-[#6B7280] line-clamp-1">
                      {product.marca?.nombre || ''}
                    </p>

                    {/* Categoría + contenido con su unidad de medida */}
                    {getCategoriaNombre(product.categoria_id) || product.contenido ? (
                      <div className="flex items-center justify-between gap-2">
                        {getCategoriaNombre(product.categoria_id) ? (
                          <span className="min-w-0 truncate text-xs font-medium px-2 py-1 rounded-full bg-[#EBF1F5] text-[#2B4C7E]">
                            {getCategoriaNombre(product.categoria_id)}
                          </span>
                        ) : (
                          <span />
                        )}
                        {product.contenido ? (
                          <span className="shrink-0 text-xs font-medium text-[#6B7280]">
                            {product.contenido} {product.unidad_medida}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between">
                      <div>
                        {product.porcentaje_descuento && product.porcentaje_descuento > 0 ? (
                          <>
                            <p className="text-sm text-[#6B7280] line-through">
                              Bs. {product.precio.toFixed(2)}
                            </p>
                            <p className="text-lg font-bold text-[#FF7B54]">
                              Bs. {product.precio_final?.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-[#2B4C7E]">
                            Bs. {product.precio.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.esta_disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.esta_disponible ? 'Disponible' : 'Agotado'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-[#2B4C7E] text-white py-2 rounded-lg font-semibold hover:bg-[#1E3A5F] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}