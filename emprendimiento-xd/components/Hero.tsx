import { ShieldCheck, MapPin, Lock } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────
 * TIPOGRAFÍA — registrada en app/layout.tsx
 * ─────────────────────────────────────────────────────────────
 *   - Logo, menú, etiqueta, texto, botones, beneficios → Poppins (--font-poppins)
 *   - Título principal → Bevan (--font-bevan)
 * ─────────────────────────────────────────────────────────────
 */

export function Hero() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/imagenes/fondo1.png')" }}>
      {/* Contenido */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:pl-8 md:pr-10 lg:pl-12 lg:pr-16 py-10 sm:py-12 md:py-20">
        <div className="max-w-2xl space-y-5 sm:space-y-7">
          {/* Etiqueta superior — Poppins Medium 14px */}
          <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-[#2B4C7E] font-[family-name:var(--font-poppins)]">
            Belleza y cuidado personal para todos
          </div>

          {/* Título principal — Bevan, 64px / 48px móvil */}
          <h1 className="font-[family-name:var(--font-bevan)] text-[36px] sm:text-[42px] md:text-[48px] lg:text-[64px] leading-[1.1] text-[#1E2229]">
            TU ESENCIA,
            <br />
            NUESTRO CUIDADO.
          </h1>

          {/* Texto descriptivo — Poppins Regular 16px, interlineado 1.6 */}
          <div className="max-w-lg space-y-3 font-[family-name:var(--font-poppins)] text-sm sm:text-base leading-[1.6] text-[#1E2229]">
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
          <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:flex-row">
            <a
              href="#productos"
              className="rounded-full bg-[#2B4C7E] px-6 sm:px-8 py-3 text-center font-[family-name:var(--font-poppins)] text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#1E3A5F]"
            >
              Ver Productos
            </a>
            <a
              href="#puntos-entrega"
              className="rounded-full border-2 border-[#2B4C7E] bg-white px-6 sm:px-8 py-3 text-center font-[family-name:var(--font-poppins)] text-sm sm:text-base font-semibold text-[#2B4C7E] transition-colors hover:bg-[#2B4C7E] hover:text-white"
            >
              Puntos de Entrega
            </a>
          </div>

          {/* Beneficios — Poppins SemiBold 15px / Regular 13px */}
          <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4 pt-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[13px] sm:text-[15px] font-semibold text-[#1E2229]">
                  Productos originales
                </p>
                <p className="text-[11px] sm:text-[13px] text-[#1E2229]/60">
                  Marcas 100% auténticas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[13px] sm:text-[15px] font-semibold text-[#1E2229]">
                  Recoge cerca de ti
                </p>
                <p className="text-[11px] sm:text-[13px] text-[#1E2229]/60">
                  Puntos estratégicos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#2B4C7E]" />
              <div className="font-[family-name:var(--font-poppins)]">
                <p className="text-[13px] sm:text-[15px] font-semibold text-[#1E2229]">
                  Compra segura
                </p>
                <p className="text-[11px] sm:text-[13px] text-[#1E2229]/60">
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