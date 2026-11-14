interface Props {
  id: string;
  title: string;
  /** A handwritten-style aside under the title. */
  aside?: string;
}

/** Shared heading for every section, so spacing and style stay consistent. */
export function SectionHeading({ id, title, aside }: Props) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 id={id} className="text-4xl sm:text-5xl">{title}</h2>
      {aside && <p className="mt-3 font-serif text-lg italic text-forest/80">{aside}</p>}
    </div>
  );
}
