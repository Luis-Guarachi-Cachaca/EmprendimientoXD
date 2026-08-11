import { MessageCircle, Mail, Phone } from "lucide-react";

export function Footer() {
  const categories = [
    "Cuidado de la Piel",
    "Cuidado Masculino",
    "Perfumes",
    "Línea Niños",
    "Protección Solar",
  ];

  return (
    <footer id="contacto" className="bg-[#1E2229] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: GLOWSPOT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#FF7B54] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold">GLOWSPOT</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Distribuidor independiente de productos Yanbal en Arani, Cochabamba. 
              Belleza y cuidado personal para ellas, ellos y los más peques, con recojo en puntos GlowSpot.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-[#2B4C7E] rounded-full flex items-center justify-center hover:bg-[#FF7B54] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#2B4C7E] rounded-full flex items-center justify-center hover:bg-[#FF7B54] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#2B4C7E] rounded-full flex items-center justify-center hover:bg-[#FF7B54] transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: CATEGORÍAS */}
          <div>
            <h3 className="text-lg font-bold mb-4">CATEGORÍAS</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-[#FF7B54] transition-colors text-sm"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: CONTACTO */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACTO</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>WhatsApp: +591 700-00000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>hola@glowspot.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 mt-1 flex-shrink-0">📍</span>
                <span>Arani, Cochabamba - Bolivia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 mt-1 flex-shrink-0">📍</span>
                <span>5 puntos de entrega activos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 GLOWSPOT - Distribuidor Independiente Yanbal - Mockup de demostración</p>
        </div>
      </div>
    </footer>
  );
}
