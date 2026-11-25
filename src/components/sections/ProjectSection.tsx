import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

export function ProjectSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading id="work-title" title="Things I've built" aside="The engineering side: what I made, and what made me curious enough to make it." />
      <p className="mb-8 max-w-2xl font-serif text-lg leading-relaxed text-forest/90">
        Here&apos;s a glimpse of what I&apos;ve been building. Explore more on{" "}
        <a
          href={siteConfig.socials.find((social) => social.label === "GitHub")?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-forest underline decoration-rose decoration-2 underline-offset-4 hover:text-rose"
        >
          my GitHub
        </a>
        .
      </p>
      <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
