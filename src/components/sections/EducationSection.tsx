export const education = [
  {
    level: "Primary Education",
    institution: "Splendid Valley English Secondary School",
    period: "Primary level",
    status: "Completed",
  },
  {
    level: "Higher Secondary Education",
    institution: "Khwopa Secondary School",
    period: "2023-2024",
    status: "Completed",
  },
  {
    level: "Bachelor's Degree",
    institution: "Pulchowk Engineering Campus",
    period: "2024-Present",
    status: "Second year completed",
    current: true,
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

      <ol className="mt-14 space-y-6 border-l border-moss/60 pl-6 sm:ml-3 sm:pl-10">
        {education.map((entry) => (
          <li key={entry.institution} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[calc(1.5rem+0.4375rem)] top-7 size-3.5 rounded-full border-4 border-paper bg-forest sm:-left-[calc(2.5rem+0.4375rem)]"
            />
            <article className="grid gap-4 rounded-lg border-2 border-moss/50 bg-cream p-5 shadow-[3px_4px_0_rgb(135_148_119/0.25)] sm:grid-cols-[1fr_auto] sm:p-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose">{entry.level}</p>
                <h2 className="mt-2 text-3xl">{entry.institution}</h2>
                {"current" in entry && entry.current ? (
                  <span className="mt-4 inline-flex rounded-full bg-sage px-3 py-1 text-sm font-medium text-forest">
                    Currently pursuing
                  </span>
                ) : null}
              </div>
              <div className="sm:text-right">
                <p className="font-serif text-lg italic text-forest">{entry.period}</p>
                <p className="mt-1 text-sm text-ink/70">{entry.status}</p>
              </div>
            </article>
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
    <ol className="mt-14 space-y-6 border-l border-moss/60 pl-6 sm:ml-3 sm:pl-10">
      {education.map((entry) => (
        <li key={entry.institution} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[calc(1.5rem+0.4375rem)] top-7 size-3.5 rounded-full border-4 border-paper bg-forest sm:-left-[calc(2.5rem+0.4375rem)]"
          />
          <article className="grid gap-4 rounded-lg border-2 border-moss/50 bg-cream p-5 shadow-[3px_4px_0_rgb(135_148_119/0.25)] sm:grid-cols-[1fr_auto] sm:p-7">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose">{entry.level}</p>
              <h3 className="mt-2 text-3xl">{entry.institution}</h3>
              {"current" in entry && entry.current ? (
                <span className="mt-4 inline-flex rounded-full bg-sage px-3 py-1 text-sm font-medium text-forest">
                  Currently pursuing
                </span>
              ) : null}
            </div>
            <div className="sm:text-right">
              <p className="font-serif text-lg italic text-forest">{entry.period}</p>
              <p className="mt-1 text-sm text-ink/70">{entry.status}</p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
