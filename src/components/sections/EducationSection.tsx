import { EducationPhoto } from "@/components/sections/EducationPhoto";

export const education = [
  {
    level: "Primary Education",
    institution: "Splendid Valley English Secondary School",
    period: "Primary level",
    status: "Completed",
    photo: "/images/education/primary.jpeg",
    photoAlt: "Splendid Valley English Secondary School",
  },
  {
    level: "Higher Secondary Education",
    institution: "Khwopa Secondary School",
    period: "2023-2024",
    status: "Completed",
    photo: "/images/education/khwopaa.jpeg",
    photoAlt: "Khwopa Secondary School",
  },
  {
    level: "Bachelor's Degree",
    institution: "Pulchowk Engineering Campus",
    period: "2024-Present",
    status: "Second year completed",
    current: true,
    photo: "/images/education/pulchowk.jpeg",
    photoAlt: "Pulchowk Engineering Campus",
  },
] as const;

export function EducationSection({ standalone = false }: { standalone?: boolean }) {
  const content = (
    <>
      <header className="max-w-2xl">
        <p className="font-serif text-lg italic text-rose">My learning journey</p>
        <h1 className="mt-2 text-5xl sm:text-6xl">Education</h1>
        <p className="mt-5 font-serif text-lg leading-relaxed text-forest/90">
          The schools and university that have shaped my knowledge, skills, and curiosity so far.
        </p>
      </header>

      <ol className="mt-14 space-y-6">
        {education.map((entry) => (
          <li key={entry.institution}>
            <EducationCard entry={entry} headingTag="h2" />
          </li>
        ))}
      </ol>
    </>
  );

  if (!standalone) {
    return (
      <section id="education" aria-labelledby="education-title" className="border-y border-moss/30 bg-cream/70">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <header className="max-w-2xl">
            <p className="font-serif text-lg italic text-rose">My learning journey</p>
            <h2 id="education-title" className="mt-2 text-5xl sm:text-6xl">Education</h2>
            <p className="mt-5 font-serif text-lg leading-relaxed text-forest/90">
              The schools and university that have shaped my knowledge, skills, and curiosity so far.
            </p>
          </header>
          <EducationList />
        </div>
      </section>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      {content}
    </main>
  );
}

function EducationList() {
  return (
    <ol className="mt-14 space-y-6">
      {education.map((entry) => (
        <li key={entry.institution}>
          <EducationCard entry={entry} headingTag="h3" />
        </li>
      ))}
    </ol>
  );
}

type EducationEntry = (typeof education)[number];

function EducationCard({
  entry,
  headingTag,
}: {
  entry: EducationEntry;
  headingTag: "h2" | "h3";
}) {
  const Heading = headingTag;

  return (
    <article className="overflow-hidden rounded-lg border-2 border-moss/50 bg-cream shadow-[3px_4px_0_rgb(135_148_119/0.25)]">
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,42%)] sm:p-7">
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose">{entry.level}</p>
          <Heading className="mt-2 text-3xl">{entry.institution}</Heading>
          {"current" in entry && entry.current ? (
            <span className="mt-4 inline-flex self-start rounded-full bg-sage px-3 py-1 text-sm font-medium text-forest">
              Currently pursuing
            </span>
          ) : null}
          <div className="mt-auto pt-5 sm:text-right">
            <p className="font-serif text-lg italic text-forest">{entry.period}</p>
            <p className="mt-1 text-sm text-ink/70">{entry.status}</p>
          </div>
        </div>

        {entry.photo ? (
          <EducationPhoto src={entry.photo} alt={entry.photoAlt} />
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-md border-2 border-dashed border-moss/60 bg-paper/60 px-4 text-center">
            <span className="font-serif text-lg italic text-forest">A school memory</span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-rose">Photo coming soon</span>
          </div>
        )}
      </div>
    </article>
  );
}
