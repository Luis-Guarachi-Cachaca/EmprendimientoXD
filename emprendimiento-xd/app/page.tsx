"use client";

import { useState, useEffect, useMemo } from "react";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getProductos, getCategorias, getGeneros } from "@/lib/supabase/queries";
import type { Producto, Categoria, Genero } from "@/types";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProductos(), getCategorias(), getGeneros()])
      .then(([productosData, categoriasData, generosData]) => {
        setProductos(productosData);
        setCategorias(categoriasData);
        setGeneros(generosData);
      })
      .catch((error) => {
        console.error("Error al cargar datos de Supabase:", error);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const matchCategoria = !selectedCategoria || p.categoria_id === selectedCategoria;
      const matchGenero = !selectedGenero || p.genero_id === selectedGenero;
      return matchCategoria && matchGenero;
    });
  }, [productos, selectedCategoria, selectedGenero]);

  return (
    <main className="flex-1">
      <Hero />

      {/* id + scroll-mt-24: punto de destino del botón "Ver Productos" del Hero */}
      <section id="productos" className="bg-[#EBF1F5] scroll-mt-24">
        <div className="container mx-auto px-4 pt-4">
          <h2 className="text-2xl font-bold text-[#2B4C7E] text-center mb-2">
            Nuestros Productos
          </h2>
        </div>

        <CategoryFilter
          categorias={categorias}
          generos={generos}
          selectedCategoria={selectedCategoria}
          selectedGenero={selectedGenero}
          onSelectCategoria={setSelectedCategoria}
          onSelectGenero={setSelectedGenero}
        />

        <div className="container mx-auto px-4 pt-2 pb-8">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-[#6B7280] py-12">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
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