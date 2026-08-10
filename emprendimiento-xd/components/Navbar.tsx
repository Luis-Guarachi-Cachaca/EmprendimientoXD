import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Yanbal
        </Link>
        <Link href="/carrito">Carrito</Link>
      </div>
    </nav>
  );
}
