import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">{product.short_description}</p>
      <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
    </article>
  );
}
