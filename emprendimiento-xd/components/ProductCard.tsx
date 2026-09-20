"use client";

import { useState, useRef } from "react";
import type { Producto } from "@/types";
import { ShoppingCart } from "lucide-react";
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
      <article className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
        {/* Imagen del producto — alto fijo, no depende de la imagen real */}
        <div className="h-56 sm:h-60 bg-[#EBF1F5] relative shrink-0 p-3">
          {producto.url_imagen ? (
            <img
              src={producto.url_imagen}
              alt={producto.nombre}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2B4C7E]/50">
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
          {/* Badge de novedad */}
          {producto.es_nuevo && (
            <span className="absolute top-2 left-2 bg-[#FF7B54] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Nuevo
            </span>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-base font-bold uppercase tracking-wide text-[#1E2229] line-clamp-2 min-h-[2.5rem]">
            {producto.nombre}
          </h3>

          {/* Precio + Contenido (ml/g) en la misma fila */}
          <div className="mt-2 min-h-[1.75rem] flex items-end justify-between gap-2">
            <div>
              {producto.porcentaje_descuento && producto.porcentaje_descuento > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <p className="text-base font-bold text-[#FF7B54]">
                    Bs. {producto.precio_final?.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#6B7280] line-through">
                    Bs. {producto.precio.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-base font-bold text-[#2B4C7E]">
                  Bs. {producto.precio.toFixed(2)}
                </p>
              )}
            </div>

            {producto.contenido && (
              <p className="shrink-0 text-xs font-medium text-[#6B7280]">
                {producto.contenido} {producto.unidad_medida}
              </p>
            )}
          </div>

          {/* Botón agregar — siempre pegado al fondo de la card */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={!producto.esta_disponible}
            className={`mt-3 w-full bg-[#2B4C7E] text-white py-1.5 rounded-md text-xs font-semibold hover:bg-[#1E3A5F] transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAnimating ? 'scale-95 bg-[#1E3A5F]' : ''
            }`}
          >
            <ShoppingCart size={13} />
            {producto.esta_disponible ? "Agregar" : "Agotado"}
          </button>
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