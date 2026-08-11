"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartTotalItems } from "@/store/cartStore";

export function Navbar() {
  const cartCount = useCartTotalItems();
  const openCart = useCartStore((state) => state.openCart);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#2B4C7E]">
            GLOWSPOT
          </Link>

          {/* Navegación derecha */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection('productos')}
              className="text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection('puntos-de-entrega')}
              className="text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Puntos de Entrega
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Contacto
            </button>
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 text-[#1E2229] hover:text-[#2B4C7E] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF7B54] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
