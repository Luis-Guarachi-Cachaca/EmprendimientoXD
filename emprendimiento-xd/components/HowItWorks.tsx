import { ShoppingCart, MessageSquare, MapPin, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const locations = [
    {
      name: "Universidad Mayor de San Simón",
      url: "https://maps.app.goo.gl/pKWMS97imLA9oj2Z9?g_st=aw",
    },
    {
      name: "Plaza Sucre",
      url: "https://maps.app.goo.gl/oPfzDFHmud6VVGsq7",
    },
    {
      name: "Plaza 14 de Septiembre",
      url: "https://maps.app.goo.gl/mwwyRHEJqE2GneQn8",
    },
    {
      name: "Correo",
      url: "https://maps.app.goo.gl/eyMntLsyudDtJ2xv9",
    },
    {
      name: "Punata",
      url: "https://maps.app.goo.gl/qVL3EjcuJ6y6kHAN8",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Bloque Superior: Imagen | Textos | 3 Tarjetas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Izquierda: Imagen ilustrativa */}
          <div className="lg:col-span-3 flex items-center justify-center order-1 lg:order-1">
            <img
              src="/imagenes/imagenPuntoReferencia.png"
              alt="Punto de entrega"
              className="w-full max-w-[300px] sm:max-w-[380px] h-auto object-contain"
            />
          </div>

          {/* Centro: Textos */}
          <div className="lg:col-span-3 flex flex-col justify-center text-left order-2 lg:order-2">
            <span className="text-[#FF7B54] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              ¿CÓMO FUNCIONA?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B4C7E] mb-3 sm:mb-4">
              Pides en línea y recoges en tu punto
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280]">
              Eliges, confirmas y
              recoges en el punto de entrega más cómodo para ti.
            </p>
          </div>

          {/* Derecha: 3 Tarjetas de pasos */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-stretch order-3 lg:order-3">
            {/* Paso 1 */}
            <div className="bg-[#EBF1F5] px-4 sm:px-5 py-3 rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="bg-[#2B4C7E] w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                  01
                </div>
                <div className="bg-[#2B4C7E] p-2 sm:p-2.5 rounded-full text-white">
                  <ShoppingCart size={22} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#2B4C7E] mb-1 sm:mb-2 text-left">
                Elige en línea
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] text-left">
                Arma tu pedido con productos para toda la familia, sin salir de casa.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#EBF1F5] px-4 sm:px-5 py-3 rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="bg-[#2B4C7E] w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                  02
                </div>
                <div className="bg-[#2B4C7E] p-2 sm:p-2.5 rounded-full text-white">
                  <MessageSquare size={22} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#2B4C7E] mb-1 sm:mb-2 text-left">
                Confirma por WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] text-left">
                Te enviamos el resumen y coordinamos el punto y horario de recojo.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#EBF1F5] px-4 sm:px-5 py-3 rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="bg-[#2B4C7E] w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                  03
                </div>
                <div className="bg-[#2B4C7E] p-2 sm:p-2.5 rounded-full text-white">
                  <MapPin size={22} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-[#2B4C7E] mb-1 sm:mb-2 text-left">
                Recoge en tu punto de entrega
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] text-left">
                Pasa por el punto que elijas. Sin costos de envío sorpresa.
              </p>
            </div>
          </div>
        </div>

        {/* Bloque Inferior: Nuestros puntos de entrega */}
        <div id="puntos-entrega" className="scroll-mt-24">
          {/* Header centrado sin fondo */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B4C7E]">
              NUESTROS PUNTOS DE ENTREGA
            </h3>
          </div>

          {/* Tarjetas de puntos de entrega */}
          <div className="bg-[#EBF1F5] rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {locations.map((location) => (
                <div
                  key={location.name}
                  className="bg-white border border-[#2B4C7E]/15 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-[#2B4C7E]/30 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="bg-[#EBF1F5] text-[#2B4C7E] rounded-full p-1.5 sm:p-2 shrink-0">
                      <MapPin size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className="font-semibold text-[#1E2229] text-xs sm:text-sm leading-snug">
                      {location.name}
                    </p>
                  </div>
                  <a
                    href={location.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#2B4C7E] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1E3A5F] transition-colors mt-auto"
                  >
                    Ver ubicación
                    <ArrowRight size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}