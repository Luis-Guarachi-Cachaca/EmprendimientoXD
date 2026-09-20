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

// Un item de carrito solo es válido si trae su producto completo con id.
// Sirve tanto para filtrar datos corruptos/viejos de localStorage como
// para blindar los selectores contra cualquier item mal formado.
function isValidCartItem(item: unknown): item is ItemCarrito {
  return (
    !!item &&
    typeof item === "object" &&
    "producto" in item &&
    !!(item as ItemCarrito).producto &&
    typeof (item as ItemCarrito).producto.id === "string"
  );
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
      partialize: (state) => ({ items: state.items }), // No persistir isOpen
      version: 1, // Súbelo (2, 3...) cada vez que cambies la forma de Producto/ItemCarrito
      migrate: (persistedState) => {
        // Si el carrito guardado en el navegador es de una versión anterior
        // de la app (campos distintos, forma distinta), lo descartamos en
        // vez de dejar que rompa la UI. El usuario simplemente ve el
        // carrito vacío en vez de un error.
        const state = persistedState as { items?: unknown[] } | undefined;
        const items = Array.isArray(state?.items)
          ? state.items.filter(isValidCartItem)
          : [];
        return { items };
      },
      // Red de seguridad extra: si por lo que sea llega algo inválido
      // (ej. localStorage editado a mano, extensión del navegador, etc.)
      // lo filtramos igual justo después de leer del storage.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = state.items.filter(isValidCartItem);
        }
      },
    }
  )
);

// Selectores computados
export const useCartTotalItems = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.cantidad, 0));

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => {
      if (!item.producto) return sum; // blindaje extra por si acaso
      const price = item.producto.porcentaje_descuento && item.producto.porcentaje_descuento > 0
        ? (item.producto.precio_final || item.producto.precio)
        : item.producto.precio;
      return sum + price * item.cantidad;
    }, 0)
  );