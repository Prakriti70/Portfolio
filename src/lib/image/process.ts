/**
 * Browser-side image processing: resize + re-encode so uploads stay small and fast.
 * Produces a full-size copy (max 2000px) and a grid thumbnail (max 800px).
 */
export interface ProcessedImage {
  full: Blob;
  thumb: Blob;
  width: number;
  height: number;
  ext: string;
}

async function resize(bitmap: ImageBitmap, maxEdge: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process the image.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  // Ask for WebP; browsers that can't encode it return PNG, so fall back to JPEG.
  let blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
  if (!blob || blob.type !== "image/webp") {
    blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
  }
  if (!blob) throw new Error("Couldn't convert the image.");
  return blob;
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file); // honours EXIF rotation
  try {
    const full = await resize(bitmap, 2000, 0.85);
    const thumb = await resize(bitmap, 800, 0.8);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    return {
      full,
      thumb,
      width: Math.round(bitmap.width * scale),
      height: Math.round(bitmap.height * scale),
      ext: full.type === "image/webp" ? "webp" : "jpg",
    };
  } finally {
    bitmap.close();
  }
}
