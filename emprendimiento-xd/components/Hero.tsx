export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#EBF1F5] to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Texto del Banner */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B4C7E] leading-tight">
              Tu belleza Yanbal, más cerca que nunca
            </h1>
            <p className="text-lg md:text-xl text-[#1E2229] leading-relaxed">
              Descubre el cuidado ideal para toda tu familia. ¡Pide online y recoge fácil en tu GlowSpot de Arani!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#2B4C7E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1E3A5F] transition-colors">
                Ver Productos
              </button>
              <button className="border-2 border-[#2B4C7E] text-[#2B4C7E] px-8 py-3 rounded-full font-semibold hover:bg-[#2B4C7E] hover:text-white transition-colors">
                Puntos de Entrega
              </button>
            </div>
          </div>

          {/* Imagen del Banner - Placeholder para collage lifestyle */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-[#2B4C7E]/20 to-[#FF7B54]/20 rounded-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-[#2B4C7E] font-semibold text-lg">
                  Imagen collage lifestyle
                </p>
                <p className="text-[#1E2229] text-sm mt-2">
                  (Mujer, hombre y niño usando productos)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
