import type { ItemCarrito } from "@/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildWhatsAppOrderMessage(items: ItemCarrito[]): string {
  const lines = items.map(
    (item) => {
      const producto = item.producto;
      const contenidoStr = producto.contenido && producto.unidad_medida 
        ? ` - ${producto.contenido} ${producto.unidad_medida}`
        : '';
      return `- ${producto.nombre}${contenidoStr} x${item.cantidad} = $${(producto.precio * item.cantidad).toFixed(2)}`
    }
  );

  const total = items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  return [
    "Hola! Quiero hacer el siguiente pedido:",
    "",
    ...lines,
    "",
    `Total: $${total.toFixed(2)}`,
  ].join("\n");
}

export function getWhatsAppOrderUrl(items: ItemCarrito[]): string {
  const message = buildWhatsAppOrderMessage(items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
