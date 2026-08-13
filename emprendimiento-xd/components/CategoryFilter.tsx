"use client";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (filter: string | null) => void;
}

const filters = [
  { id: "novedades", label: "Novedades GLOWSPOT" },
  { id: "esencial", label: "Cuidado Esencial" },
  { id: "hombres", label: "Para Él" },
  { id: "mujeres", label: "Para Ella" },
  { id: "ninos", label: "Pequeños Héroes" },
  { id: "solar", label: "Protección Solar" },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    // id + scroll-mt-24: punto de destino del botón "Ver Productos" del Hero.
    // El scroll-mt deja un margen arriba al llegar, por si hay navbar fija.
    <div id="productos" className="flex flex-wrap gap-3 justify-center py-8 scroll-mt-24">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onSelect(filter.id)}
          className={`
            px-6 py-2 rounded-full font-medium transition-all duration-200
            ${selected === filter.id 
              ? 'bg-[#2B4C7E] text-white shadow-md' 
              : 'bg-[#EBF1F5] text-[#1E2229] hover:bg-[#2B4C7E] hover:text-white'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}