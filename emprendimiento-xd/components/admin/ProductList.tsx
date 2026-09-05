"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types";
import { ProductForm } from "./ProductForm";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand_line?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

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

  const handleCreate = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

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
          product={editingProduct}
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
              {searchTerm ? (
                <p>No se encontraron productos que coincidan con la búsqueda.</p>
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
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#2B4C7E]/50">
                        <span className="text-sm">Sin imagen</span>
                      </div>
                    )}
                    {product.is_new && (
                      <span className="absolute top-2 left-2 bg-[#FF7B54] text-white text-xs font-bold px-2 py-1 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-[#1E2229] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] line-clamp-1">
                      {product.brand_line}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount_percentage && product.discount_percentage > 0 ? (
                          <>
                            <p className="text-sm text-[#6B7280] line-through">
                              Bs. {product.price.toFixed(2)}
                            </p>
                            <p className="text-lg font-bold text-[#FF7B54]">
                              Bs. {product.final_price?.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-[#2B4C7E]">
                            Bs. {product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_available ? 'Disponible' : 'Agotado'}
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
