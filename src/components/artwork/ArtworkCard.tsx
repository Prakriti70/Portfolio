"use client";
import { useState } from "react";
import type { Artwork } from "@/types/artwork";
import { formatMonthYear } from "@/lib/utils";

interface Props {
  artwork: Artwork;
  onOpen: () => void;
}

/** One tile in the masonry grid. Images keep their natural proportions. */
export function ArtworkCard({ artwork, onOpen }: Props) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(artwork.thumbUrl) && !failed;
  const meta = [artwork.medium, formatMonthYear(artwork.madeOn)].filter(Boolean).join(", ");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open “${artwork.title}”`}
      className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border-2 border-moss/40 bg-cream text-left transition-colors hover:border-forest"
    >
      {hasImage ? (
        // Plain <img>: width/height reserve space (no layout shift), and the files are already resized at upload.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artwork.thumbUrl}
          alt={`${artwork.title}${artwork.medium ? `, ${artwork.medium}` : ""}`}
          width={artwork.width}
          height={artwork.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
          style={artwork.width && artwork.height ? { aspectRatio: `${artwork.width} / ${artwork.height}` } : undefined}
        />
      ) : artwork.body ? (
        <p className="line-clamp-6 whitespace-pre-line bg-paper p-5 font-serif text-lg italic leading-relaxed text-forest">
          {artwork.body}
        </p>
      ) : (
        <div className="grid aspect-[4/3] place-items-center bg-sage px-4 text-center text-sm text-ink">
          This image couldn&apos;t be loaded.
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl">{artwork.title}</h3>
        {meta && <p className="text-sm text-forest/80">{meta}</p>}
        {artwork.description && <p className="mt-1 line-clamp-2 text-sm">{artwork.description}</p>}
        {artwork.isSample && <p className="mt-2 text-xs italic text-rose">Sample content, not my work</p>}
      </div>
    </button>
  );
}
