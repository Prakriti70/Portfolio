import type { Artwork, ArtworkCategory } from "@/types/artwork";

/** Filter by category. "All" returns everything. */
export function filterArtwork(items: Artwork[], category: ArtworkCategory | "All"): Artwork[] {
  return category === "All" ? items : items.filter((a) => a.category === category);
}

/** Categories that actually have work in them, so filter chips are never dead ends. */
export function usedCategories(items: Artwork[]): ArtworkCategory[] {
  const seen = new Set(items.map((a) => a.category));
  return [...seen];
}

/** Move one item from `from` to `to` without mutating the original list. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}
