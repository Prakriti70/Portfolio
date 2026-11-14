"use client";
import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArtworkRow } from "@/types/artwork";
import { processImage } from "@/lib/image/process";
import { insertArtwork, uploadFile } from "@/lib/supabase/admin";
import { ARTWORK_BUCKET } from "@/lib/supabase/artwork";
import { validateImageFile } from "@/lib/validation/artwork";
import { ArtworkFields, emptyValues, parseValues, type FieldErrors, type FormValues } from "./ArtworkFields";

interface Props {
  client: SupabaseClient;
  onCreated: (row: ArtworkRow) => void;
}

/** Adds one new entry: validates, resizes the image in the browser, uploads it, then saves the details. */
export function UploadForm({ client, onCreated }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const busy = progress !== null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const { data, errors: fieldErrors } = parseValues(values);
    setErrors(fieldErrors);
    if (!data) return;

    if (file) {
      const problem = validateImageFile(file);
      if (problem) return setMessage({ kind: "error", text: problem });
    } else if (!(data.category === "Writing" && data.body)) {
      return setMessage({ kind: "error", text: "Choose an image, or pick “Writing” and add the text." });
    }

    const uploaded: string[] = [];
    try {
      setProgress(0);
      let files = {};
      if (file) {
        const img = await processImage(file);
        const id = crypto.randomUUID();
        const imagePath = `${id}/full.${img.ext}`;
        const thumbPath = `${id}/thumb.${img.ext}`;
        await uploadFile(client, imagePath, img.full, (f) => setProgress(f * 0.8));
        uploaded.push(imagePath);
        await uploadFile(client, thumbPath, img.thumb, (f) => setProgress(0.8 + f * 0.2));
        uploaded.push(thumbPath);
        files = { imagePath, thumbPath, width: img.width, height: img.height };
      }
      const row = await insertArtwork(client, data, files);
      onCreated(row);
      setValues(emptyValues);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setMessage({ kind: "ok", text: `“${row.title}” was added. It shows on the public site within about a minute.` });
    } catch (err) {
      // Don't leave orphaned files behind if saving the entry failed
      if (uploaded.length) await client.storage.from(ARTWORK_BUCKET).remove(uploaded);
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setProgress(null);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border-2 border-moss/50 bg-cream p-6">
      <h2 className="text-2xl">Add something new</h2>
      <div>
        <label htmlFor="up-file" className="font-medium text-forest">Image (JPG, PNG or WebP, up to 20 MB)</label>
        <input
          id="up-file"
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            const problem = f ? validateImageFile(f) : null;
            setMessage(problem ? { kind: "error", text: problem } : null);
            setFile(problem ? null : f);
            if (problem && fileRef.current) fileRef.current.value = "";
          }}
          className="mt-1 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-sage file:px-4 file:font-medium file:text-ink"
        />
      </div>
      <ArtworkFields idPrefix="new" values={values} errors={errors} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />

      {busy && (
        <div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((progress ?? 0) * 100)} aria-label="Upload progress" className="h-3 overflow-hidden rounded-full bg-sage">
            <div className="h-full bg-forest transition-[width]" style={{ width: `${(progress ?? 0) * 100}%` }} />
          </div>
          <p className="mt-1 text-sm">Uploading… {Math.round((progress ?? 0) * 100)}%</p>
        </div>
      )}
      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={message.kind === "error" ? "rounded bg-paper p-3 text-midnight" : "rounded bg-sage p-3 text-ink"}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="min-h-12 rounded-full border-2 border-forest bg-forest px-7 font-semibold text-cream disabled:opacity-60">
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
