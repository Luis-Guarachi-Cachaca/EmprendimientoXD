"use client";

import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={selected === null ? "font-bold" : ""}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={selected === category.id ? "font-bold" : ""}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
