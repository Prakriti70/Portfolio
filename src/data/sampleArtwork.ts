import type { Artwork } from "@/types/artwork";

/**
 * Sample pieces shown ONLY when Supabase isn't configured (or has no artwork yet).
 * The images are generated placeholders, not real work, and the gallery says so.
 */
export const sampleArtwork: Artwork[] = [
  {
    id: "sample-a1", isSample: true, sortOrder: 1,
    title: "Pond at dusk", category: "Paintings", medium: "Placeholder image",
    description: "A stand-in painting. Upload your own in the admin area and these samples disappear.",
    note: "Notes about the idea or feeling behind a piece live here.",
    imageUrl: "/images/artwork/sample-1.svg", thumbUrl: "/images/artwork/sample-1.svg", width: 800, height: 1000,
  },
  {
    id: "sample-a2", isSample: true, sortOrder: 2,
    title: "Moss study", category: "Sketches", medium: "Placeholder image",
    description: "Sketches keep their natural proportions: no forced cropping.",
    imageUrl: "/images/artwork/sample-2.svg", thumbUrl: "/images/artwork/sample-2.svg", width: 1000, height: 700,
  },
  {
    id: "sample-a3", isSample: true, sortOrder: 3,
    title: "Small poem", category: "Writing",
    description: "Poems and short writing can stand on their own, with no image needed.",
    body: "Replace this with a poem of your own.\nLine breaks are kept exactly\nas you type them.",
  },
  {
    id: "sample-a4", isSample: true, sortOrder: 4,
    title: "Rose clay", category: "Crafts", medium: "Placeholder image",
    description: "Crafts, digital work and experiments all share the same gallery.",
    imageUrl: "/images/artwork/sample-3.svg", thumbUrl: "/images/artwork/sample-3.svg", width: 900, height: 900,
  },
  {
    id: "sample-a5", isSample: true, sortOrder: 5,
    title: "Night garden", category: "Digital", medium: "Placeholder image",
    description: "A tall piece, to show how the masonry layout handles different heights.",
    imageUrl: "/images/artwork/sample-4.svg", thumbUrl: "/images/artwork/sample-4.svg", width: 700, height: 1100,
  },
  {
    id: "sample-a6", isSample: true, sortOrder: 6,
    title: "Colour test", category: "Experiments", medium: "Placeholder image",
    description: "A wide experiment.",
    imageUrl: "/images/artwork/sample-5.svg", thumbUrl: "/images/artwork/sample-5.svg", width: 1100, height: 700,
  },
];
