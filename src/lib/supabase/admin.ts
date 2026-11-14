import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArtworkRow } from "@/types/artwork";
import type { ArtworkInput } from "@/lib/validation/artwork";
import { MAX_UPLOAD_BYTES } from "@/lib/validation/artwork";
import { ARTWORK_BUCKET } from "./artwork";
import { supabaseAnonKey, supabaseUrl } from "./client";

/**
 * Admin-only operations. These run in the browser using YOUR login session.
 * The database and storage policies (supabase/migrations) decide whether they succeed,
 * so a visitor calling these functions would simply be refused.
 */

/** Upload a file with real progress events (supabase-js doesn't expose them). */
export function uploadFile(
  client: SupabaseClient,
  path: string,
  blob: Blob,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  if (blob.size > MAX_UPLOAD_BYTES) {
    return Promise.reject(new Error("The processed image is still over 5 MB. Try a smaller file."));
  }
  return client.auth.getSession().then(
    ({ data }) =>
      new Promise<void>((resolve, reject) => {
        const token = data.session?.access_token;
        if (!token) return reject(new Error("You're signed out. Sign in again."));
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${supabaseUrl}/storage/v1/object/${ARTWORK_BUCKET}/${path}`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("apikey", supabaseAnonKey);
        xhr.setRequestHeader("Content-Type", blob.type);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Upload failed (${xhr.status}). Are you set up as an admin?`));
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(blob);
      }),
  );
}

export interface NewArtworkFiles {
  imagePath?: string;
  thumbPath?: string;
  width?: number;
  height?: number;
}

/** New entries go to the top: sort_order is one less than the current smallest. */
export async function insertArtwork(
  client: SupabaseClient,
  input: ArtworkInput,
  files: NewArtworkFiles,
): Promise<ArtworkRow> {
  const { data: first } = await client
    .from("artworks")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1);
  const sortOrder = (first?.[0]?.sort_order ?? 1) - 1;

  const { data, error } = await client
    .from("artworks")
    .insert({
      title: input.title,
      category: input.category,
      medium: input.medium ?? null,
      made_on: input.madeOn ?? null,
      description: input.description,
      note: input.note ?? null,
      body: input.body ?? null,
      image_path: files.imagePath ?? null,
      thumb_path: files.thumbPath ?? null,
      width: files.width ?? null,
      height: files.height ?? null,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ArtworkRow;
}

export async function updateArtwork(client: SupabaseClient, id: string, input: ArtworkInput): Promise<void> {
  const { error } = await client
    .from("artworks")
    .update({
      title: input.title,
      category: input.category,
      medium: input.medium ?? null,
      made_on: input.madeOn ?? null,
      description: input.description,
      note: input.note ?? null,
      body: input.body ?? null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Delete the row, then its image files. */
export async function deleteArtwork(client: SupabaseClient, row: ArtworkRow): Promise<void> {
  const { error } = await client.from("artworks").delete().eq("id", row.id);
  if (error) throw new Error(error.message);
  const paths = [row.image_path, row.thumb_path].filter((p): p is string => Boolean(p));
  if (paths.length) await client.storage.from(ARTWORK_BUCKET).remove(paths);
}

/** Save a new order: position in the list becomes sort_order. */
export async function saveOrder(client: SupabaseClient, orderedIds: string[]): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) => client.from("artworks").update({ sort_order: index }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}
