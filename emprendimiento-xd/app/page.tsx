"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import type { Product } from "@/types";

// Productos de ejemplo (diversos para mostrar inclusividad)
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sérum Facial Renovador",
    slug: "serum-facial-renovador",
    short_description: "Cuidado esencial unisex para piel radiante",
    description: "Sérum facial que renueva y revitaliza la piel, ideal para todo tipo de piel.",
    brand_line: "Yanbal",
    price: 189.00,
    image_url: null,
    category_id: "esencial",
    stock: 10,
    sort_order: 1,
    is_new: true,
    is_active: true,
  },
  {
    id: "2",
    name: "Colonia Infantil Suave",
    slug: "colonia-infantil-suave",
    short_description: "Fragancia suave y delicada para pequeños héroes",
    description: "Colonia hipoalergénica specially formulada para la piel sensible de los niños.",
    brand_line: "Yanbal Kids",
    price: 78.00,
    image_url: null,
    category_id: "ninos",
    stock: 15,
    sort_order: 2,
    is_new: true,
    is_active: true,
  },
  {
    id: "3",
    name: "Protector Solar SPF 50",
    slug: "protector-solar-spf-50",
    short_description: "Protección completa para toda la familia",
    description: "Protector solar de amplio espectro, resistente al agua.",
    brand_line: "Yanbal",
    price: 125.00,
    image_url: null,
    category_id: "solar",
    stock: 20,
    sort_order: 3,
    is_new: false,
    is_active: true,
  },
  {
    id: "4",
    name: "Eau de Toilette Masculino",
    slug: "eau-de-toilette-masculino",
    short_description: "Fragancia elegante y moderna para él",
    description: "Perfume masculino con notas frescas y madera.",
    brand_line: "Yanbal Homme",
    price: 250.00,
    image_url: null,
    category_id: "hombres",
    stock: 8,
    sort_order: 4,
    is_new: false,
    is_active: true,
  },
  {
    id: "5",
    name: "Crema Hidratante Unisex",
    slug: "crema-hidratante-unisex",
    short_description: "Hidratación profunda para todo tipo de piel",
    description: "Crema hidratante ligera de absorción rápida.",
    brand_line: "Yanbal",
    price: 95.00,
    image_url: null,
    category_id: "esencial",
    stock: 25,
    sort_order: 5,
    is_new: false,
    is_active: true,
  },
  {
    id: "6",
    name: "Lápiz Labial Long Lasting",
    slug: "lapiz-labial-long-lasting",
    short_description: "Color intenso y larga duración para ella",
    description: "Lápiz labial con fórmula hidratante y pigmentos de alta calidad.",
    brand_line: "Yanbal",
    price: 68.00,
    image_url: null,
    category_id: "mujeres",
    stock: 30,
    sort_order: 6,
    is_new: true,
    is_active: true,
  },
];

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredProducts = selectedFilter
    ? mockProducts.filter((p) => p.category_id === selectedFilter)
    : mockProducts;

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
          
          {filteredProducts.length === 0 ? (
            <p className="text-center text-[#6B7280] py-12">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
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
