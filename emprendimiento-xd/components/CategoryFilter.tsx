"use client";

import type { Categoria, Genero } from "@/types";
import {
  LayoutGrid,
  Users,
  User,
  Mars,
  Venus,
  Baby,
  SprayCan,
  Brush,
  Smile,
  Sun,
  Droplet,
  Gem,
  Tag,
  type LucideIcon,
} from "lucide-react";

interface CategoryFilterProps {
  categorias: Categoria[];
  generos: Genero[];
  selectedCategoria: string | null;
  selectedGenero: string | null;
  onSelectCategoria: (categoriaId: string | null) => void;
  onSelectGenero: (generoId: string | null) => void;
}

// Ícono + color pastel por slug de categoría. Si aparece una categoría
// nueva sin slug mapeado, cae en un ícono/color genérico en vez de romper.
const CATEGORIA_STYLE: Record<string, { icon: LucideIcon; bg: string; text: string }> = {
  "perfumes-y-fragancias": { icon: SprayCan, bg: "bg-violet-100", text: "text-violet-600" },
  maquillaje: { icon: Brush, bg: "bg-pink-100", text: "text-pink-600" },
  "cuidado-facial": { icon: Smile, bg: "bg-teal-100", text: "text-teal-600" },
  "proteccion-solar": { icon: Sun, bg: "bg-amber-100", text: "text-amber-600" },
  "cuidado-corporal-y-capilar": { icon: Droplet, bg: "bg-sky-100", text: "text-sky-600" },
  "joyeria-y-accesorios": { icon: Gem, bg: "bg-indigo-100", text: "text-indigo-600" },
};
const CATEGORIA_STYLE_DEFAULT = { icon: Tag, bg: "bg-[#EBF1F5]", text: "text-[#2B4C7E]" };

// Ícono por slug de género.
const GENERO_ICONS: Record<string, LucideIcon> = {
  unisex: User,
  "para-el": Mars,
  "para-ella": Venus,
  ninos: Baby,
};

// Quita cualquier aclaración entre paréntesis del nombre, ej.
// "Cuidado Facial (Tratamiento Facial)" -> "Cuidado Facial"
function limpiarNombre(nombre: string) {
  return nombre.replace(/\s*\([^)]*\)/g, "").trim();
}

export function CategoryFilter({
  categorias,
  generos,
  selectedCategoria,
  selectedGenero,
  onSelectCategoria,
  onSelectGenero,
}: CategoryFilterProps) {
  return (
    // id + scroll-mt-24: punto de destino del botón "Ver Productos" del Hero.
    // El scroll-mt deja un margen arriba al llegar, por si hay navbar fija.
    <div id="productos" className="scroll-mt-24 py-10 px-4">
      <div className="relative max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-[#EBF1F5] via-[#EBF1F5]/50 to-white overflow-hidden">
        <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1px_1fr] gap-6 lg:gap-10 p-6 md:p-8">
          {/* Género (izquierda) — lista vertical, ocupa poco ancho */}
          <div className="flex flex-col gap-3 lg:w-56">
            <div className="flex items-center gap-1.5 text-[#FF7B54]">
              <Users size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Género
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <GenderPill
                label="Todos"
                icon={Users}
                active={selectedGenero === null}
                onClick={() => onSelectGenero(null)}
              />
              {generos.map((genero) => (
                <GenderPill
                  key={genero.id}
                  label={genero.nombre}
                  icon={GENERO_ICONS[genero.slug] ?? User}
                  active={selectedGenero === genero.id}
                  onClick={() => onSelectGenero(genero.id)}
                />
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className="hidden lg:block w-px self-stretch bg-[#2B4C7E]/15" />
          <div className="h-px w-24 mx-auto bg-[#2B4C7E]/15 lg:hidden" />

          {/* Categoría (derecha) — píldoras con ícono, usan todo el ancho */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-1.5 text-[#2B4C7E]">
              <Tag size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Categoría
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <CategoryPill
                label="Todas"
                icon={LayoutGrid}
                active={selectedCategoria === null}
                onClick={() => onSelectCategoria(null)}
              />
              {categorias.map((categoria) => {
                const style = CATEGORIA_STYLE[categoria.slug] ?? CATEGORIA_STYLE_DEFAULT;
                return (
                  <CategoryPill
                    key={categoria.id}
                    label={limpiarNombre(categoria.nombre)}
                    icon={style.icon}
                    iconBg={style.bg}
                    iconText={style.text}
                    active={selectedCategoria === categoria.id}
                    onClick={() => onSelectCategoria(categoria.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenderPill({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold
        transition-all duration-200 border
        ${
          active
            ? "bg-[#2B4C7E] text-white border-[#2B4C7E] shadow-md shadow-[#2B4C7E]/20"
            : "bg-white text-[#1E2229] border-[#2B4C7E]/10 hover:border-[#2B4C7E]/30 hover:text-[#2B4C7E]"
        }
      `}
    >
      <Icon size={18} className={active ? "text-white" : "text-[#2B4C7E]"} />
      {label}
    </button>
  );
}

function CategoryPill({
  label,
  icon: Icon,
  iconBg,
  iconText,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  iconBg?: string;
  iconText?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 text-left
        transition-all duration-200 border
        ${
          active
            ? "bg-[#2B4C7E] border-[#2B4C7E] shadow-md shadow-[#2B4C7E]/20"
            : "bg-white border-[#2B4C7E]/10 hover:border-[#2B4C7E]/30 hover:shadow-sm"
        }
      `}
    >
      <span
        className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${
          active ? "bg-white/15" : iconBg ?? "bg-[#EBF1F5]"
        }`}
      >
        <Icon size={18} className={active ? "text-white" : iconText ?? "text-[#2B4C7E]"} />
      </span>
      <span className={`text-sm font-semibold leading-snug ${active ? "text-white" : "text-[#1E2229]"}`}>
        {label}
      </span>
    </button>
  );
}