import { ShoppingCart, MessageSquare, MapPin } from "lucide-react";

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
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#FF7B54] font-semibold text-sm uppercase tracking-wider">
            ¿CÓMO FUNCIONA?
          </span>
          <h2 className="text-4xl font-bold text-[#2B4C7E] mt-3 mb-4">
            Pides en línea y recoges en tu punto
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Sin domicilios ni recargas: eliges, confirmas y
            recoges en el punto de entrega más cómodo para ti.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#EBF1F5] p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-[#2B4C7E] p-4 rounded-full text-white mb-6">
              <ShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2B4C7E] mb-3">Paso 1: Elige en línea</h3>
            <p className="text-[#6B7280]">
              Arma tu pedido con productos para toda la familia, sin salir de casa.
            </p>
          </div>

          <div className="bg-[#EBF1F5] p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-[#2B4C7E] p-4 rounded-full text-white mb-6">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2B4C7E] mb-3">Paso 2: Confirma por WhatsApp</h3>
            <p className="text-[#6B7280]">
              Te enviamos el resumen y coordinamos el punto y horario de recojo.
            </p>
          </div>

          <div className="bg-[#EBF1F5] p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-[#2B4C7E] p-4 rounded-full text-white mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#2B4C7E] mb-3">Paso 3: Recoge en tu punto de entrega</h3>
            <p className="text-[#6B7280]">
              Pasa por el punto que elijas. Sin costos de envío sorpresa.
            </p>
          </div>
        </div>

        {/* Location Cards — id + scroll-mt-24: punto de destino del botón "Puntos de Entrega" del Hero */}
        <div id="puntos-entrega" className="text-center scroll-mt-24">
          <h3 className="text-2xl font-bold text-[#2B4C7E] mb-8">NUESTROS PUNTOS DE ENTREGA</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full">
            {locations.map((location) => (
              <div
                key={location.name}
                className="flex items-center gap-4 bg-white border border-[#2B4C7E]/15 rounded-2xl px-5 py-5 shadow-sm hover:shadow-md hover:border-[#2B4C7E]/30 transition-all"
              >
                <div className="shrink-0 bg-[#EBF1F5] text-[#2B4C7E] rounded-full p-3">
                  <MapPin size={26} />
                </div>
                <div className="flex flex-col items-start gap-2 min-w-0">
                  <p className="font-semibold text-[#1E2229] leading-snug text-left">
                    {location.name}
                  </p>
                  <a
                    href={location.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#2B4C7E] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#1E3A5F] transition-colors"
                  >
                    <MapPin size={14} />
                    Ver ubicación
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}