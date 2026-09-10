import { ShieldCheck, MapPin, Lock } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────
 * TIPOGRAFÍA — agregar esto en app/layout.tsx (una sola vez)
 * ─────────────────────────────────────────────────────────────
 *
 *   import { Poppins, Montserrat } from "next/font/google";
 *
 *   const poppins = Poppins({
 *     subsets: ["latin"],
 *     weight: ["400", "500", "600", "700"],
 *     variable: "--font-poppins",
 *   });
 *
 *   const montserrat = Montserrat({
 *     subsets: ["latin"],
 *     weight: ["800"],
 *     variable: "--font-montserrat",
 *   });
 *
 *   // en <body className={`${poppins.variable} ${montserrat.variable}`}>
 *
 * Uso por elemento:
 *   - Logo, menú, etiqueta, texto, botones, beneficios → Poppins
 *   - Título principal → Montserrat ExtraBold (800)
 * ─────────────────────────────────────────────────────────────
 */

export function Hero() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/imagenes/fondo1.png')" }}>
      {/* Contenido */}
      <div className="relative z-10 w-full pl-4 pr-6 md:pl-8 md:pr-10 lg:pl-12 lg:pr-16 py-12 md:py-20">
        <div className="max-w-2xl space-y-7">
          {/* Etiqueta superior — Poppins Medium 14px */}
          <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-[#2B4C7E] font-[family-name:var(--font-poppins)]">
            Belleza y cuidado personal para todos
          </div>

          {/* Título principal — Montserrat ExtraBold, 64px / 48px móvil */}
          <h1 className="font-[family-name:var(--font-montserrat)] text-[48px] font-extrabold leading-[1.1] text-[#1E2229] md:text-[64px]">
            Tu esencia,
            <br />
            nuestro cuidado.
          </h1>

          {/* Texto descriptivo — Poppins Regular 16px, interlineado 1.6 */}
          <div className="max-w-lg space-y-3 font-[family-name:var(--font-poppins)] text-base leading-[1.6] text-[#1E2229]">
            <p>
              Descubre una amplia selección de productos de belleza y
              cuidado personal para mujeres, hombres y niños.
            </p>
            <p>
              Trabajamos con las mejores marcas para ofrecerte calidad,
              confianza y bienestar en cada elección.
            </p>
            <p>
              Pide online y recoge en nuestros puntos de entrega de forma
              rápida, segura y sin complicaciones.
            </p>
          </div>

          {/* Botones — llevan a las secciones #productos y #puntos-entrega de la misma página */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <a
              href="#productos"
              className="rounded-full bg-[#2B4C7E] px-8 py-3 text-center font-[family-name:var(--font-poppins)] text-base font-semibold text-white transition-colors hover:bg-[#1E3A5F]"
            >
              Ver Productos
            </a>
            <a
              href="#puntos-entrega"
              className="rounded-full border-2 border-[#2B4C7E] bg-white px-8 py-3 text-center font-[family-name:var(--font-poppins)] text-base font-semibold text-[#2B4C7E] transition-colors hover:bg-[#2B4C7E] hover:text-white"
            >
              Puntos de Entrega
            </a>
          </div>

          {/* Beneficios — Poppins SemiBold 15px / Regular 13px */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[15px] font-semibold text-[#1E2229]">
                  Productos originales
                </p>
                <p className="text-[13px] text-[#1E2229]/60">
                  Marcas 100% auténticas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[15px] font-semibold text-[#1E2229]">
                  Recoge cerca de ti
                </p>
                <p className="text-[13px] text-[#1E2229]/60">
                  Puntos estratégicos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[15px] font-semibold text-[#1E2229]">
                  Compra segura
                </p>
                <p className="text-[13px] text-[#1E2229]/60">
                  Tu información protegida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}