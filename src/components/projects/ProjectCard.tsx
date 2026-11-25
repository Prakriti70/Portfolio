"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

const aspectClass = { wide: "aspect-[16/9]", square: "aspect-square", tall: "aspect-[3/4]" } as const;
const statusLabel = { idea: "An idea", "in-progress": "In progress", finished: "Finished", paused: "Paused" } as const;
const isDev = process.env.NODE_ENV !== "production";

/** One project. The "why I made it" text is tucked behind a button so the grid stays calm. */
export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const hasLink = Boolean(project.repoUrl || project.demoUrl);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border-2 border-moss/50 bg-cream transition-colors hover:border-forest">
      <div className={cn("relative overflow-hidden bg-sage", aspectClass[project.aspect])}>
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
            className="absolute inset-0"
          >
            <Image
              src={project.thumbnail}
              alt={project.thumbnailAlt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </a>
        ) : (
          <Image
            src={project.thumbnail}
            alt={project.thumbnailAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl">{project.title}</h3>
          {project.status && (
            <span className="mt-1 shrink-0 rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-ink">
              {statusLabel[project.status]}
            </span>
          )}
        </div>
        <p>{project.description}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex min-h-11 items-center gap-2 self-start font-serif text-base italic text-forest underline decoration-rose decoration-2 underline-offset-4"
        >
          <Lightbulb aria-hidden="true" className="size-4" />
          Why I made this
        </button>
        <div id={panelId} hidden={!open} className="rounded-md bg-paper p-4 font-serif text-[0.95rem] italic leading-relaxed text-forest">
          {project.inspiration}
        </div>

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.technologies.map((t) => (
            <li key={t} className="rounded border border-moss/60 px-2 py-0.5 text-xs text-forest">{t}</li>
          ))}
        </ul>
        <p className="text-sm text-ink/80"><span className="font-medium text-forest">My part:</span> {project.role}</p>

        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-1">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-medium text-forest underline underline-offset-4 transition-all hover:gap-2">
              View the code <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-medium text-forest underline underline-offset-4 transition-all hover:gap-2">
              Live demo <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
          {!hasLink && isDev && (
            <span className="text-xs italic text-rose">[dev only] no repoUrl or demoUrl yet. Hidden in production.</span>
          )}
        </div>
      </div>
    </article>
  );
}
