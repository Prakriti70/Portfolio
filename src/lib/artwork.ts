import type { Artwork, ArtworkCategory } from "@/types/artwork";

/** Split plain-text descriptions into paragraphs while preserving line breaks within each paragraph. */
export function splitDescriptionIntoParagraphs(description: string): string[] {
  return description
    .trim()
    .split(/\r?\n[ \t]*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function filterArtwork(items: Artwork[], category: ArtworkCategory | "All"): Artwork[] {
  return category === "All" ? items : items.filter((a) => a.category === category);
}

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
