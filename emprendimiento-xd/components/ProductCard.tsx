"use client";

import type { Product } from "@/types";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Imagen del producto */}
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
        {/* Badge de novedad */}
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-[#FF7B54] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Nuevo
          </span>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-[#1E2229] line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[2.5rem]">
          {product.short_description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-bold text-[#2B4C7E]">
            Bs. {product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-[#2B4C7E] text-white p-2 rounded-full hover:bg-[#1E3A5F] transition-colors"
            aria-label="Agregar al carrito"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
