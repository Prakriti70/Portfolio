import { z } from "zod";
import { ARTWORK_CATEGORIES } from "@/types/artwork";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Limit for the ORIGINAL file; it is resized in the browser before upload. */
export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
/** Matches the bucket's server-side limit (5 MB) for the processed file. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Returns an error message, or null when the file is fine. */
export function validateImageFile(file: { type: string; size: number; name: string }): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" isn't a JPG, PNG or WebP image.`;
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return `"${file.name}" is larger than ${MAX_SOURCE_BYTES / 1024 / 1024} MB.`;
  }
  return null;
}

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

export const artworkInputSchema = z.object({
  title: z.string().trim().min(1, "Give it a title.").max(120, "Keep the title under 120 characters."),
  category: z.enum(ARTWORK_CATEGORIES),
  medium: z.preprocess(emptyToUndefined, z.string().trim().max(80, "Medium: 80 characters max.").optional()),
  madeOn: z.preprocess(
    emptyToUndefined,
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.").optional(),
  ),
  description: z.string().trim().max(1000, "Description: 1000 characters max."),
  note: z.preprocess(emptyToUndefined, z.string().trim().max(1500, "Note: 1500 characters max.").optional()),
  body: z.preprocess(emptyToUndefined, z.string().max(5000, "Writing: 5000 characters max.").optional()),
});

export type ArtworkInput = z.infer<typeof artworkInputSchema>;
