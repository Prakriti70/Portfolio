import { createPublicClient } from "@/lib/supabase/client";
import { fetchArtwork } from "@/lib/supabase/artwork";
import { sampleArtwork } from "@/data/sampleArtwork";
import type { Artwork } from "@/types/artwork";
import { ArtGallery } from "@/components/artwork/ArtGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Server component: loads artwork from Supabase, or falls back to labelled samples. */
export async function ArtSection() {
  const client = createPublicClient();
  let items: Artwork[] = sampleArtwork;
  let loadError: string | undefined;

  if (client) {
    const result = await fetchArtwork(client);
    if (result.error) {
      console.error("Art Journal: could not load artwork:", result.error);
      loadError = result.error;
      items = [];
    } else if (result.items.length > 0) {
      items = result.items;
    }
  }

  return (
    <section id="art" aria-labelledby="art-title" className="border-y border-moss/30 bg-sage/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading id="art-title" title="Art Journal" aside="Paintings, sketches, poems and small experiments, in whatever order they happened." />
        <ArtGallery items={items} loadError={loadError} />
      </div>
    </section>
  );
}
