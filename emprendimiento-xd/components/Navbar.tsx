"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore, useCartTotalItems } from "@/store/cartStore";

export function Navbar() {
  const cartCount = useCartTotalItems();
  const openCart = useCartStore((state) => state.openCart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-[#2B4C7E]">
            GLOWSPOT
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            <button
              onClick={() => scrollToSection('productos')}
              className="text-sm md:text-base text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection('puntos-de-entrega')}
              className="text-sm md:text-base text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Puntos de Entrega
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-sm md:text-base text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
            >
              Contacto
            </button>
            <button
              onClick={openCart}
              data-cart-icon
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

          {/* Botón menú móvil */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={openCart}
              data-cart-icon
              className="relative flex items-center gap-2 text-[#1E2229] hover:text-[#2B4C7E] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF7B54] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1E2229] hover:text-[#2B4C7E] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('productos')}
                className="text-left text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
              >
                Productos
              </button>
              <button
                onClick={() => scrollToSection('puntos-de-entrega')}
                className="text-left text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
              >
                Puntos de Entrega
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-left text-[#1E2229] hover:text-[#2B4C7E] transition-colors font-medium"
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}