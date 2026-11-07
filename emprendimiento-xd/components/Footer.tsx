import { Mail, Phone } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// Categorías que se ocultan visualmente (sin tocar backend/base de datos)
const CATEGORIAS_OCULTAS = ["Maquillaje"];

// Quita acentos/diacríticos y pasa a minúsculas, para comparar sin importar
// mayúsculas/minúsculas y tildes
function normalizarParaComparar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Footer() {
  const categories = [
    "Cuidado de la Piel",
    "Cuidado Masculino",
    "Perfumes",
    "Línea Niños",
    "Protección Solar",
  ];

  const whatsappNumber = "59174307669";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const socialCards = [
    {
      icon: FaWhatsapp,
      iconColor: "#25D366",
      title: "Contáctanos en WhatsApp",
      subtitle: "Te atendemos al instante",
      href: whatsappUrl,
      ariaLabel: "Abrir WhatsApp de K’acha Encanto",
      target: true,
    },
    {
      icon: FaFacebookF,
      iconColor: "#1877F2",
      title: "Síguenos en Facebook",
      subtitle: "Conoce nuestras novedades",
      href: "https://www.facebook.com/share/14qsoiQ93Rh/",
      ariaLabel: "Abrir Facebook de K’acha Encanto",
      target: true,
    },
    {
      icon: FaTiktok,
      iconColor: "#000000",
      title: "Síguenos en TikTok",
      subtitle: "Tips, trends y más",
      href: "https://www.tiktok.com/@kachaencanto",
      ariaLabel: "Abrir TikTok de K’acha Encanto",
      target: true,
      hasBorder: true,
    },
    {
      icon: MdEmail,
      iconColor: "#64748B",
      title: "Envíanos un correo",
      subtitle: "Estamos para ayudarte",
      href: "mailto:glowspot83@gmail.com",
      ariaLabel: "Enviar correo a K’acha Encanto",
      target: false,
    },
  ];

  return (
    <footer id="contacto" className="bg-[#1E2229] text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-8 lg:gap-12">
          {/* Columna 1: K’acha Encanto */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img
                src="/imagenes/logo-kacha-encanto.png"
                alt="K’acha Encanto Accesorios"
                className="h-28 w-28 rounded-2xl object-cover"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[500px]">
              Distribuidor independiente de productos en Cochabamba. 
              Belleza y cuidado personal para ellas, ellos y los más peques, con recojo en puntos de entrega.
            </p>
            
            {/* Subtítulo redes sociales */}
            <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
              SÍGUENOS EN NUESTRAS REDES
            </p>
            
            {/* Tarjetas de redes sociales - 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {socialCards.map((card) => {
                const Icon = card.icon;
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={card.target ? "_blank" : undefined}
                    rel={card.target ? "noopener noreferrer" : undefined}
                    aria-label={card.ariaLabel}
                    className="group relative flex items-center gap-3 p-4 rounded-2xl border border-white/22 bg-white/2 hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4C7E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2229] cursor-pointer min-h-[72px] min-w-0"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div 
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: card.iconColor,
                        ...(card.hasBorder ? { border: "1px solid rgba(255,255,255,0.2)" } : {})
                      }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-[13px] font-semibold leading-snug overflow-wrap-anywhere">
                        {card.title}
                      </span>
                      <span className="text-gray-400 text-[11px] leading-snug mt-1 whitespace-nowrap">
                        {card.subtitle}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columna 2: CATEGORÍAS */}
          <div>
            <h3 className="text-lg font-bold mb-4">CATEGORÍAS</h3>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-[#FF7B54] transition-colors text-[15px] whitespace-nowrap"
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
            <ul className="space-y-4 text-gray-400 text-[15px]">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="whitespace-nowrap">WhatsApp: +591 74307669</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <a 
                  href="mailto:glowspot83@gmail.com" 
                  className="hover:text-[#FF7B54] transition-colors whitespace-nowrap"
                >
                  glowspot83@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 mt-1 flex-shrink-0">📍</span>
                <span className="whitespace-nowrap">Cochabamba - Bolivia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 mt-1 flex-shrink-0">📍</span>
                <span className="whitespace-nowrap">5 puntos de entrega activos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 K’acha Encanto - Distribuidor Independiente</p>
        </div>
      </div>
    </footer>
  );
}
