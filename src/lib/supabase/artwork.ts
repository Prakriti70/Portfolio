import type { SupabaseClient } from "@supabase/supabase-js";
import type { Artwork, ArtworkRow } from "@/types/artwork";
import { supabaseUrl } from "./client";

export const ARTWORK_BUCKET = "artwork";

/** Public URL of a file in the artwork bucket. */
export function storageUrl(path: string | null): string | undefined {
  return path ? `${supabaseUrl}/storage/v1/object/public/${ARTWORK_BUCKET}/${path}` : undefined;
}

/** Database row -> the shape the gallery components use. */
export function rowToArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    medium: row.medium ?? undefined,
    madeOn: row.made_on ?? undefined,
    description: row.description,
    note: row.note ?? undefined,
    body: row.body ?? undefined,
    imageUrl: storageUrl(row.image_path),
    thumbUrl: storageUrl(row.thumb_path ?? row.image_path),
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    sortOrder: row.sort_order,
  };
}

export interface ArtworkResult {
  items: Artwork[];
  rows: ArtworkRow[];
  error?: string;
}

/** Fetch every artwork entry, in the order the owner chose. */
export async function fetchArtwork(client: SupabaseClient): Promise<ArtworkResult> {
  const { data, error } = await client
    .from("artworks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return { items: [], rows: [], error: error.message };
  const rows = (data ?? []) as ArtworkRow[];
  return { items: rows.map(rowToArtwork), rows };
}
