import type { CartItem } from "@/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildWhatsAppOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (item) =>
      `- ${item.product.name} x${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`
  );

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
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

export function getWhatsAppOrderUrl(items: CartItem[]): string {
  const message = buildWhatsAppOrderMessage(items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
