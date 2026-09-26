"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { getProductos, getCategorias, getGeneros } from "@/lib/supabase/queries";
import { useSearchStore } from "@/store/searchStore";
import type { Producto, Categoria, Genero } from "@/types";

// Cantidad de productos que se muestran por página en la grilla.
const PRODUCTOS_POR_PAGINA = 10;

// Quita acentos/diacríticos y pasa a minúsculas, para que "rose" encuentre
// "Rosé", "ROSA", etc. sin importar cómo lo haya escrito el cliente.
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchStore((state) => state.query);

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

  // Id del género "unisex": aunque se oculta como pill en el filtro,
  // sus productos deben aparecer al elegir "Para Él" o "Para Ella".
  const unisexId = useMemo(
    () => generos.find((g) => g.slug === "unisex")?.id ?? null,
    [generos]
  );
  const selectedGeneroSlug = useMemo(
    () => generos.find((g) => g.id === selectedGenero)?.slug ?? null,
    [generos, selectedGenero]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizar(searchQuery.trim());

    return productos.filter((p) => {
      const matchCategoria = !selectedCategoria || p.categoria_id === selectedCategoria;

      const incluyeUnisex =
        unisexId !== null &&
        p.genero_id === unisexId &&
        (selectedGeneroSlug === "para-el" || selectedGeneroSlug === "para-ella");

      const matchGenero =
        !selectedGenero || p.genero_id === selectedGenero || incluyeUnisex;

      const matchBusqueda =
        normalizedQuery === "" || normalizar(p.nombre).includes(normalizedQuery);

      return matchCategoria && matchGenero && matchBusqueda;
    });
  }, [productos, selectedCategoria, selectedGenero, unisexId, selectedGeneroSlug, searchQuery]);

  // Cada vez que cambian los filtros o la búsqueda, volvemos a la página 1
  // (si no, se podría quedar "atascado" en una página que ya no existe).
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoria, selectedGenero, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTOS_POR_PAGINA)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTOS_POR_PAGINA;
    return filteredProducts.slice(start, start + PRODUCTOS_POR_PAGINA);
  }, [filteredProducts, currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

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

        <div className="container mx-auto px-4 pt-0 pb-8">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-[#6B7280] py-12">
              {searchQuery.trim()
                ? `No encontramos productos para "${searchQuery}".`
                : "No hay productos en esta categoría."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {paginatedProducts.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>

              {/* Paginación — solo se muestra si hay más de una página */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-[#2B4C7E]/20 bg-white text-[#2B4C7E] transition-colors hover:bg-[#2B4C7E] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#2B4C7E]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="text-sm font-semibold text-[#1E2229]">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                    className="flex items-center justify-center h-10 w-10 rounded-full border border-[#2B4C7E]/20 bg-white text-[#2B4C7E] transition-colors hover:bg-[#2B4C7E] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#2B4C7E]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
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