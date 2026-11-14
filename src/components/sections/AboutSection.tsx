import { siteConfig } from "@/config/site";

export function AboutSection() {
  const { about } = siteConfig;
  return (
    <section aria-labelledby="about-title" className="border-y border-moss/30 bg-cream/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <h2 id="about-title" className="inline-block -rotate-1 text-4xl sm:text-5xl">
            {about.heading}
            <svg aria-hidden="true" viewBox="0 0 200 10" className="mt-1 block h-2.5 w-full text-rose" preserveAspectRatio="none">
              <path d="M2 6 C 40 1, 80 9, 120 4 S 180 6, 198 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </h2>
          <div className="mt-6 max-w-prose space-y-4 font-serif text-lg leading-relaxed">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <aside aria-label="A few things about me" className="relative h-fit rotate-1 bg-paper p-6 shadow-[4px_5px_0_0_rgb(135_148_119/0.45)]">
          <span aria-hidden="true" className="tape absolute -top-3 left-8 block h-5 w-20 -rotate-3" />
          <h3 className="font-serif text-2xl">A few things about me</h3>
          <dl className="mt-4 space-y-3">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="font-serif text-sm italic text-forest/80">{f.label}</dt>
                <dd className="text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
