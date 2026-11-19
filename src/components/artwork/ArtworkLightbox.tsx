"use client";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Artwork } from "@/types/artwork";
import { formatMonthYear } from "@/lib/utils";
import { splitDescriptionIntoParagraphs } from "@/lib/artwork";

interface Props {
  artwork: Artwork | null;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/**
 * Detail view built on the native <dialog> element, which gives us a focus trap,
 * Escape-to-close and focus restoration without extra code.
 * Arrow keys move between pieces; clicking the dark backdrop or the big X closes it.
 */
export function ArtworkLightbox({ artwork, hasPrev, hasNext, onPrev, onNext, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = artwork !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft" && hasPrev) onPrev();
    if (e.key === "ArrowRight" && hasNext) onNext();
  }

  const meta = artwork ? [artwork.medium, formatMonthYear(artwork.madeOn)].filter(Boolean).join(", ") : "";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="lightbox-title"
      className="m-auto max-h-[94dvh] w-[min(96vw,64rem)] overflow-y-auto rounded-xl border-0 bg-cream p-0 text-ink shadow-2xl"
    >
      {artwork && (
        <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
          <div className="grid place-items-center bg-paper p-3 md:p-5">
            {artwork.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artwork.imageUrl}
                alt={`${artwork.title}${artwork.medium ? `, ${artwork.medium}` : ""}`}
                width={artwork.width}
                height={artwork.height}
                className="h-auto max-h-[70dvh] w-auto max-w-full rounded object-contain md:max-h-[84dvh]"
              />
            ) : (
              <p className="whitespace-pre-line p-4 font-serif text-xl italic leading-relaxed text-forest md:text-2xl">
                {artwork.body}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-8">
            <h2 id="lightbox-title" className="pr-12 text-3xl">{artwork.title}</h2>
            {meta && <p className="text-sm text-forest/80">{meta}</p>}
            {splitDescriptionIntoParagraphs(artwork.description).map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
            {artwork.imageUrl && artwork.body && (
              <p className="whitespace-pre-line font-serif italic text-forest">{artwork.body}</p>
            )}
            {artwork.note && (
              <div className="rounded-md bg-paper p-4">
                <p className="font-serif text-sm italic text-forest/80">The idea behind it</p>
                <p className="mt-1 font-serif italic text-forest">{artwork.note}</p>
              </div>
            )}
            {artwork.isSample && <p className="text-xs italic text-rose">Sample content, not my work</p>}

            <div className="mt-auto flex gap-2 pt-2">
              <button type="button" onClick={onPrev} disabled={!hasPrev} className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-forest px-4 text-forest disabled:opacity-40">
                <ChevronLeft aria-hidden="true" className="size-4" /> Previous
              </button>
              <button type="button" onClick={onNext} disabled={!hasNext} className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-forest px-4 text-forest disabled:opacity-40">
                Next <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid size-12 place-items-center rounded-full bg-forest text-cream shadow-md"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      )}
    </dialog>
  );
}
