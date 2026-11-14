"use client";
import { useMemo, useState } from "react";
import { ARTWORK_CATEGORIES, type Artwork, type ArtworkCategory } from "@/types/artwork";
import { filterArtwork } from "@/lib/artwork";
import { FilterChips } from "@/components/ui/FilterChips";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkLightbox } from "./ArtworkLightbox";

type Filter = "All" | ArtworkCategory;
const filters: readonly Filter[] = ["All", ...ARTWORK_CATEGORIES];

interface Props {
  items: Artwork[];
  /** A friendly message when the database could not be reached. */
  loadError?: string;
}

/** Masonry gallery with category filters and a detail lightbox. It only receives data; it never fetches. */
export function ArtGallery({ items, loadError }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => filterArtwork(items, filter), [items, filter]);
  const openIndex = visible.findIndex((a) => a.id === openId);
  const current = openIndex >= 0 ? visible[openIndex] : null;

  return (
    <div>
      <div className="mb-8">
        <FilterChips label="Filter art by category" options={filters} value={filter} onChange={setFilter} />
      </div>

      {loadError && (
        <p role="alert" className="mb-6 rounded-md border-2 border-rose bg-cream p-4">
          The gallery couldn&apos;t load right now. Try refreshing in a moment.
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-moss p-10 text-center font-serif text-lg italic text-forest">
          {filter === "All" ? "The sketchbook is empty for now." : `Nothing in ${filter} yet. Check back soon, or try another page of the sketchbook.`}
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
