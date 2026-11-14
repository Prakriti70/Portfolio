"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import type { ArtworkRow } from "@/types/artwork";
import { storageUrl } from "@/lib/supabase/artwork";
import { ArtworkFields, parseValues, type FieldErrors, type FormValues } from "./ArtworkFields";

interface Props {
  row: ArtworkRow;
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onSave: (id: string, values: FormValues) => Promise<void>;
  onDelete: (row: ArtworkRow) => Promise<void>;
}

const toValues = (r: ArtworkRow): FormValues => ({
  title: r.title, category: r.category, medium: r.medium ?? "", madeOn: r.made_on ?? "",
  description: r.description, note: r.note ?? "", body: r.body ?? "",
});

const iconBtn = "grid size-11 place-items-center rounded-full border-2 border-moss/60 text-forest hover:border-forest disabled:opacity-40";

/** One row in the admin list: reorder, edit details, or delete. */
export function ArtworkEditor({ row, index, count, onMove, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<FormValues>(() => toValues(row));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const thumb = storageUrl(row.thumb_path ?? row.image_path);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { data, errors: fe } = parseValues(values);
    setErrors(fe);
    if (!data) return;
    setBusy(true);
    setError("");
    try {
      await onSave(row.id, values);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete “${row.title}”? This also deletes its image and can't be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await onDelete(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete.");
      setBusy(false);
    }
  }

  return (
    <li className="rounded-lg border-2 border-moss/40 bg-cream p-4">
      <div className="flex items-center gap-3">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" width={64} height={64} className="size-16 shrink-0 rounded object-cover" />
        ) : (
          <div aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded bg-paper font-serif text-xs italic">text</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg text-forest">{row.title}</p>
          <p className="text-sm text-ink/70">{row.category}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" className={iconBtn} aria-label={`Move “${row.title}” up`} disabled={busy || index === 0} onClick={() => onMove(-1)}><ArrowUp aria-hidden="true" className="size-4" /></button>
          <button type="button" className={iconBtn} aria-label={`Move “${row.title}” down`} disabled={busy || index === count - 1} onClick={() => onMove(1)}><ArrowDown aria-hidden="true" className="size-4" /></button>
          <button type="button" className={iconBtn} aria-label={`Edit “${row.title}”`} aria-expanded={editing} disabled={busy} onClick={() => setEditing((v) => !v)}><Pencil aria-hidden="true" className="size-4" /></button>
          <button type="button" className={iconBtn} aria-label={`Delete “${row.title}”`} disabled={busy} onClick={remove}><Trash2 aria-hidden="true" className="size-4" /></button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 rounded bg-paper p-3 text-midnight">{error}</p>}
      {editing && (
        <form onSubmit={save} noValidate className="mt-4 space-y-4 border-t border-moss/40 pt-4">
          <ArtworkFields idPrefix={`edit-${row.id}`} values={values} errors={errors} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
          <button type="submit" disabled={busy} className="min-h-11 rounded-full border-2 border-forest bg-forest px-6 font-semibold text-cream disabled:opacity-60">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </li>
  );
}
