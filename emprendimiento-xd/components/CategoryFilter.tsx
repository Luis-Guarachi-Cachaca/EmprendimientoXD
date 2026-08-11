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
    <div className="flex flex-wrap gap-3 justify-center py-8">
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
