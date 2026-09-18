"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getProductos } from "@/lib/supabase/queries";
import type { Producto } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log("🔄 Cargando productos desde Supabase...");
      const data = await getProductos();
      console.log("✅ Productos cargados:", data);
      setProducts(data);
    } catch (error) {
      console.error("❌ Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedFilter
    ? products.filter((p) => p.categoria_id === selectedFilter)
    : products;

  return (
    <main className="flex-1">
      <Hero />
      
      <section className="bg-white">
        <CategoryFilter 
          selected={selectedFilter} 
          onSelect={setSelectedFilter} 
        />
      </section>

      <section id="productos" className="bg-[#EBF1F5] py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#2B4C7E] text-center mb-8">
            Nuestros Productos
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4C7E]"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-[#6B7280] py-12">
              No hay productos disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="puntos-de-entrega">
        <HowItWorks />
      </section>

      <Footer />
      
      <CartSidebar />
    </main>
  );
}
