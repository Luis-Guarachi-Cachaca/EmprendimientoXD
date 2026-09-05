import { ProductList } from "@/components/admin/ProductList";

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-[#EBF1F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <ProductList />
      </div>
    </div>
  );
}
