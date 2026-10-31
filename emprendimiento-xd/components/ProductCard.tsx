"use client";

import { useState, useRef, useEffect } from "react";
import type { Producto } from "@/types";
import { ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingImage, setFlyingImage] = useState<{ x: number; y: number; opacity: number; scale: number } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mientras la ventana de detalles está abierta: Escape la cierra y se
  // bloquea el scroll de la página de fondo.
  useEffect(() => {
    if (!isDetailOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDetailOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDetailOpen]);

  const handleAddToCart = () => {
    if (!producto.esta_disponible) return;

    setIsAnimating(true);

    // Animación del botón
    setTimeout(() => setIsAnimating(false), 200);

    // Animación de producto volando al carrito
    const buttonRect = buttonRef.current?.getBoundingClientRect();

    // Puede haber más de un [data-cart-icon] en el DOM (versión desktop y
    // mobile del navbar, una de ellas oculta por CSS según el ancho de
    // pantalla). Buscamos el que esté realmente visible para que la
    // animación llegue al ícono correcto.
    const cartIcons = document.querySelectorAll<HTMLElement>('[data-cart-icon]');
    let cartRect: DOMRect | undefined;
    cartIcons.forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        cartRect = rect;
      }
    });

    if (buttonRect && cartRect) {
      const targetRect = cartRect; // const: TS lo mantiene como definido dentro del setTimeout de abajo

      setFlyingImage({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        opacity: 1,
        scale: 1,
      });

      // Animación hacia el carrito
      setTimeout(() => {
        setFlyingImage({
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
          opacity: 0,
          scale: 0.3,
        });
      }, 50);

      // Limpiar después de la animación
      setTimeout(() => {
        setFlyingImage(null);
      }, 1200);
    }

    addItem(producto);
  };

  // Agregar desde la ventana de detalles: se cierra la ventana y se reutiliza
  // la misma lógica (y animación hacia el carrito) del botón de la tarjeta.
  const handleAddFromDetail = () => {
    setIsDetailOpen(false);
    handleAddToCart();
  };

  return (
    <>
      <article className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
        {/* Imagen del producto — alto fijo, no depende de la imagen real. Al tocarla se abren los detalles */}
        <div
          onClick={() => setIsDetailOpen(true)}
          className="h-48 sm:h-56 md:h-60 bg-[#EBF1F5] relative shrink-0 p-2 sm:p-3 cursor-pointer"
        >
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
            <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-[#FF7B54] text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
              Nuevo
            </span>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-2.5 sm:p-3 flex flex-col flex-1">
          <h3
            onClick={() => setIsDetailOpen(true)}
            className="text-sm sm:text-base font-bold uppercase tracking-wide text-[#1E2229] line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] cursor-pointer"
          >
            {producto.nombre}
          </h3>

          {/* Precio + Contenido (ml/g) en la misma fila */}
          <div className="mt-1.5 sm:mt-2 min-h-[1.5rem] sm:min-h-[1.75rem] flex items-end justify-between gap-2">
            <div>
              {producto.porcentaje_descuento && producto.porcentaje_descuento > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <p className="text-sm sm:text-base font-bold text-[#FF7B54]">
                    Bs. {producto.precio_final?.toFixed(2)}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#6B7280] line-through">
                    Bs. {producto.precio.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-bold text-[#2B4C7E]">
                  Bs. {producto.precio.toFixed(2)}
                </p>
              )}
            </div>

            {producto.contenido && (
              <p className="shrink-0 text-[11px] sm:text-xs font-medium text-[#6B7280]">
                {producto.contenido} {producto.unidad_medida}
              </p>
            )}
          </div>

          {/* Botón para ver los detalles (descripción) del producto */}
          <button
            type="button"
            onClick={() => setIsDetailOpen(true)}
            className="mt-1 self-start py-1 text-[11px] sm:text-xs font-semibold text-[#2B4C7E] hover:underline"
          >
            Ver detalles
          </button>

          {/* Botón agregar — siempre pegado al fondo de la card */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={!producto.esta_disponible}
            className={`mt-2 sm:mt-3 w-full bg-[#2B4C7E] text-white py-2 sm:py-1.5 rounded-md text-xs sm:text-xs font-semibold hover:bg-[#1E3A5F] transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] ${
              isAnimating ? 'scale-95 bg-[#1E3A5F]' : ''
            }`}
          >
            <ShoppingCart size={13} />
            {producto.esta_disponible ? "Agregar" : "Agotado"}
          </button>
        </div>
      </article>

      {/* Ventana de detalles — panel desde abajo en celular, ventana centrada en PC */}
      {isDetailOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 sm:p-6"
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${producto.nombre}`}
            className="relative flex w-full sm:max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              aria-label="Cerrar detalles"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1E2229] shadow hover:bg-white"
            >
              <X size={18} />
            </button>

            {/* Contenido con scroll: imagen + información */}
            <div className="min-h-0 flex-1 overflow-y-auto sm:grid sm:grid-cols-2">
              <div className="relative flex items-center justify-center bg-[#EBF1F5] p-4">
                {producto.url_imagen ? (
                  <img
                    src={producto.url_imagen}
                    alt={producto.nombre}
                    className="h-56 w-full object-contain sm:h-72"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center text-[#2B4C7E]/50 sm:h-72">
                    <span className="text-sm">Sin imagen</span>
                  </div>
                )}
                {producto.es_nuevo && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#FF7B54] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Nuevo
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#1E2229] sm:pr-8">
                  {producto.nombre}
                </h3>

                {producto.contenido && (
                  <p className="text-sm font-medium text-[#6B7280]">
                    Contenido: {producto.contenido} {producto.unidad_medida}
                  </p>
                )}

                <div>
                  <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-[#2B4C7E]">
                    Descripción
                  </h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#1E2229]/80">
                    {producto.descripcion_completa ||
                      producto.descripcion_corta ||
                      "Este producto aún no tiene descripción."}
                  </p>
                </div>
              </div>
            </div>

            {/* Pie fijo: precio + agregar, siempre visible aunque la descripción sea larga */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white p-3 sm:p-4">
              <div>
                {producto.porcentaje_descuento && producto.porcentaje_descuento > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-[#FF7B54]">
                      Bs. {producto.precio_final?.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#6B7280] line-through">
                      Bs. {producto.precio.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-[#2B4C7E]">
                    Bs. {producto.precio.toFixed(2)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddFromDetail}
                disabled={!producto.esta_disponible}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#2B4C7E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A5F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                {producto.esta_disponible ? "Agregar al carrito" : "Agotado"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Imagen volando hacia el carrito */}
      {flyingImage && producto.url_imagen && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-[1100ms] ease-in-out"
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