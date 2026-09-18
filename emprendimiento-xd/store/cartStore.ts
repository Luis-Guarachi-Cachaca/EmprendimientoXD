import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrito, Producto } from "@/types";

interface CartState {
  items: ItemCarrito[];
  isOpen: boolean;
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (producto, cantidad = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.producto.id === producto.id
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { producto, cantidad }],
          };
        });
      },

      removeItem: (productoId) => {
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
        }));
      },

      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { 
      name: "yanbal-cart",
      partialize: (state) => ({ items: state.items }) // No persistir isOpen
    }
  )
);

// Selectores computados
export const useCartTotalItems = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.cantidad, 0));

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => {
      const price = item.producto.porcentaje_descuento && item.producto.porcentaje_descuento > 0
        ? (item.producto.precio_final || item.producto.precio)
        : item.producto.precio;
      return sum + price * item.cantidad;
    }, 0)
  );
