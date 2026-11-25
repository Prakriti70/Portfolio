"use client";
import { useState } from "react";
import type { Artwork } from "@/types/artwork";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkLightbox } from "./ArtworkLightbox";

interface Props {
  items: Artwork[];
  loadError?: string;
}

/** Paintings gallery with a detail lightbox. It only receives data; it never fetches. */
export function ArtGallery({ items, loadError }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = items.filter((artwork) => artwork.category === "Paintings");
  const openIndex = visible.findIndex((a) => a.id === openId);
  const current = openIndex >= 0 ? visible[openIndex] : null;

  return (
    <div>
      {loadError && (
        <p role="alert" className="mb-6 rounded-md border-2 border-rose bg-cream p-4">
          Some online artwork couldn&apos;t load. The paintings included with the site are still available.
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-moss p-10 text-center font-serif text-lg italic text-forest">
          The painting gallery is empty for now.
        </p>
      ) : (
        <div className="columns-2 gap-4 lg:columns-3 xl:columns-4">
          {visible.map((a) => (
            <ArtworkCard key={a.id} artwork={a} onOpen={() => setOpenId(a.id)} />
          ))}
        </div>
      )}

      <ArtworkLightbox
        artwork={current}
        hasPrev={openIndex > 0}
        hasNext={openIndex >= 0 && openIndex < visible.length - 1}
        onPrev={() => setOpenId(visible[openIndex - 1].id)}
        onNext={() => setOpenId(visible[openIndex + 1].id)}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}
