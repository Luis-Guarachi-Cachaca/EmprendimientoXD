import { ShoppingCart, MessageSquare, MapPin } from "lucide-react";

export function HowItWorks() {
  const locations = [
    "Universidad Mayor de San Simón",
    "Plaza Sucre",
    "Plaza 14 de Septiembre",
    "Correo",
    "Punata",
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#FF7B54] font-semibold text-sm uppercase tracking-wider">
            CÓMO FUNCIONA
          </span>
          <h2 className="text-4xl font-bold text-[#2B4C7E] mt-3 mb-4">
            Pides en línea, recoges en tu punto
          </h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Click & Collect pensado para Arani. Sin domicilios ni recargas: eliges, confirmas y
            recoges en el GlowSpot más cómodo para ti.
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
            <h3 className="text-xl font-bold text-[#2B4C7E] mb-3">Paso 3: Recoge en tu GlowSpot</h3>
            <p className="text-[#6B7280]">
              Pasa por el punto que elijas en Arani. Sin costos de envío sorpresa.
            </p>
          </div>
        </div>

        {/* Location Buttons */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#2B4C7E] mb-6">Nuestros GlowSpots</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {locations.map((location) => (
              <button
                key={location}
                className="bg-[#EBF1F5] text-[#1E2229] px-6 py-3 rounded-full font-medium hover:bg-[#2B4C7E] hover:text-white transition-colors"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
