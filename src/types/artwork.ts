export const ARTWORK_CATEGORIES = [
  "Paintings",
  "Sketches",
  "Digital",
  "Writing",
  "Crafts",
  "Experiments",
] as const;

export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number];

/** What the public gallery works with, independent of where the data came from. */
export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  /** Free text, e.g. "Watercolour on paper". */
  medium?: string;
  /** ISO date (YYYY-MM-DD). */
  madeOn?: string;
  description: string;
  /** The idea or feeling behind the piece. */
  note?: string;
  /** Poems and short writing can live without an image. */
  body?: string;
  imageUrl?: string;
  thumbUrl?: string;
  width?: number;
  height?: number;
  sortOrder: number;
  isSample?: boolean;
}

/** One row of the `artworks` table in Supabase. */
export interface ArtworkRow {
  id: string;
  title: string;
  category: ArtworkCategory;
  medium: string | null;
  made_on: string | null;
  description: string;
  note: string | null;
  body: string | null;
  image_path: string | null;
  thumb_path: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
}
