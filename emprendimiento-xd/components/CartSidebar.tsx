"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCartStore, useCartTotalPrice, useCartTotalItems } from "@/store/cartStore";
import type { ItemCarrito } from "@/types";

export function CartSidebar() {
  const { items, updateQuantity, removeItem, isOpen, closeCart } = useCartStore();
  const totalPrice = useCartTotalPrice();
  const totalItems = useCartTotalItems();
  const [customerName, setCustomerName] = useState("");

  const handleContactSeller = () => {
    const whatsappNumber = "59174307669";
    
    // Construir mensaje de productos
    let message = "";
    
    if (customerName.trim()) {
      message = `Hola, soy ${customerName.trim()}. Me gustaría cotizar los siguientes productos de GLOWSPOT:\n\n`;
    } else {
      message = `Hola, me gustaría cotizar los siguientes productos de GLOWSPOT:\n\n`;
    }

    items.forEach((item: ItemCarrito) => {
      const price = item.producto.porcentaje_descuento && item.producto.porcentaje_descuento > 0
        ? (item.producto.precio_final || item.producto.precio)
        : item.producto.precio;
      message += `• ${item.producto.nombre} (x${item.cantidad}) — Bs. ${(price * item.cantidad).toFixed(2)}\n`;
    });

    message += `\nTotal: Bs. ${totalPrice.toFixed(2)}`;
    // message += `\n\nQuisiera coordinar el punto de recojo en Arani.`; POR AHORA NO ESTA HABILITADO ESTA OPCION.

    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    let whatsappUrl: string;

    if (isMobile) {
      // Móvil: usar la app de WhatsApp
      whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    } else {
      // PC: usar WhatsApp Web
      whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    }

    window.open(whatsappUrl, "_blank");
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md bg-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#2B4C7E]">Carrito</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-[#1E2229]" />
            </button>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[#6B7280]">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item: ItemCarrito) => (
                  <div
                    key={item.producto.id}
                    className="flex gap-4 p-4 bg-[#EBF1F5] rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.producto.url_imagen ? (
                        <img
                          src={item.producto.url_imagen}
                          alt={item.producto.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-[#2B4C7E]/50 text-xs">Sin imagen</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1E2229] text-sm line-clamp-2">
                        {item.producto.nombre}
                      </h3>
                      <div className="mt-1">
                        {item.producto.porcentaje_descuento && item.producto.porcentaje_descuento > 0 ? (
                          <>
                            <p className="text-xs text-[#6B7280] line-through">
                              Bs. {item.producto.precio.toFixed(2)}
                            </p>
                            <p className="text-[#FF7B54] font-bold">
                              Bs. {item.producto.precio_final?.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-[#2B4C7E] font-bold">
                            Bs. {item.producto.precio.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#2B4C7E] hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-[#1E2229]">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#2B4C7E] hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.producto.id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors self-start"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1E2229]">Total</span>
                <span className="text-2xl font-bold text-[#2B4C7E]">
                  Bs. {totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Customer Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4C7E] focus:border-transparent"
                />
              </div>

              {/* Contact Button */}
              <button
                onClick={handleContactSeller}
                className="w-full bg-[#FF7B54] text-white py-3 rounded-lg font-semibold hover:bg-[#E66A45] transition-colors"
              >
                Contactarse con un vendedor
              </button>

              {/* Footer Text */}
              <p className="text-center text-sm text-[#6B7280]">
                {totalItems} productos · Recoge en tu punto GLOWSPOT
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
