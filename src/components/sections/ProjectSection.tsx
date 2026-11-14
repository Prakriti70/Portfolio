import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading id="work-title" title="Things I've built" aside="The engineering side: what I made, and what made me curious enough to make it." />
      <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
