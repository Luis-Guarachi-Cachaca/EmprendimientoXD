"use client";

import { useState, useRef } from "react";
import type { Producto } from "@/types";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingImage, setFlyingImage] = useState<{ x: number; y: number; opacity: number; scale: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    if (!producto.esta_disponible) return;

    setIsAnimating(true);

    // Animación del botón
    setTimeout(() => setIsAnimating(false), 200);

    // Animación de producto volando al carrito
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
    const cartRect = cartIcon?.getBoundingClientRect();

    if (buttonRect && cartRect) {
      setFlyingImage({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        opacity: 1,
        scale: 1,
      });

      // Animación hacia el carrito
      setTimeout(() => {
        setFlyingImage({
          x: cartRect.left + cartRect.width / 2,
          y: cartRect.top + cartRect.height / 2,
          opacity: 0,
          scale: 0.3,
        });
      }, 50);

      // Limpiar después de la animación
      setTimeout(() => {
        setFlyingImage(null);
      }, 600);
    }

    addItem(producto);
  };

  return (
    <>
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Imagen del producto */}
        <div className="aspect-square bg-[#EBF1F5] relative">
          {producto.url_imagen ? (
            <img
              src={producto.url_imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2B4C7E]/50">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
          {/* Badge de novedad */}
          {producto.es_nuevo && (
            <span className="absolute top-3 left-3 bg-[#FF7B54] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Nuevo
            </span>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-[#1E2229] line-clamp-2 min-h-[2.5rem]">
            {producto.nombre}
            {producto.contenido && producto.unidad_medida && (
              <span className="text-sm font-normal text-[#6B7280] ml-2">
                {producto.contenido} {producto.unidad_medida}
              </span>
            )}
          </h3>
          <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[2.5rem]">
            {producto.descripcion_corta}
          </p>

          <div className="pt-2 space-y-3">
            <div>
              {producto.porcentaje_descuento && producto.porcentaje_descuento > 0 ? (
                <>
                  <p className="text-sm text-[#6B7280] line-through">
                    Bs. {producto.precio.toFixed(2)}
                  </p>
                  <p className="text-xl font-bold text-[#FF7B54]">
                    Bs. {producto.precio_final?.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-[#2B4C7E]">
                  Bs. {producto.precio.toFixed(2)}
                </p>
              )}
            </div>
            <button
              ref={buttonRef}
              onClick={handleAddToCart}
              disabled={!producto.esta_disponible}
              className={`w-full bg-[#2B4C7E] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1E3A5F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isAnimating ? 'scale-95 bg-[#1E3A5F]' : ''
              }`}
            >
              <Plus className="w-4 h-4" />
              {producto.esta_disponible ? "Agregar al carrito" : "Agotado"}
            </button>
          </div>
        </div>
      </article>

      {/* Imagen volando hacia el carrito */}
      {flyingImage && producto.url_imagen && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-500 ease-in-out"
          style={{
            left: `${flyingImage.x}px`,
            top: `${flyingImage.y}px`,
            opacity: flyingImage.opacity,
            transform: `translate(-50%, -50%) scale(${flyingImage.scale})`,
          }}
        >
          <img
            src={producto.url_imagen}
            alt={producto.nombre}
            className="w-12 h-12 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}
