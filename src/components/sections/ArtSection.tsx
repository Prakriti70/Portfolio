import { createPublicClient } from "@/lib/supabase/client";
import { fetchArtwork } from "@/lib/supabase/artwork";
import { localArtwork } from "@/data/localArtwork";
import type { Artwork } from "@/types/artwork";
import { ArtGallery } from "@/components/artwork/ArtGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Server component: shows local paintings and any additional artwork stored in Supabase. */
export async function ArtSection() {
  const client = createPublicClient();
  let items: Artwork[] = localArtwork;
  let loadError: string | undefined;

  if (client) {
    const result = await fetchArtwork(client);
    if (result.error) {
      console.error("Art Journal: could not load artwork:", result.error);
      loadError = result.error;
    } else if (result.items.length > 0) {
      items = [...result.items, ...localArtwork];
    }
  }

  return (
    <section id="art" aria-labelledby="art-title" className="border-y border-moss/30 bg-sage/30">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading id="art-title" title="Art Journal" aside="A collection of my paintings." />
        <ArtGallery items={items} loadError={loadError} />
      </div>
    </section>
  );
}
