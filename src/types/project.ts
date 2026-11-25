export type ProjectStatus = "idea" | "in-progress" | "finished" | "paused";

export interface Project {
  id: string;
  title: string;
  /** Used by the filter chips, e.g. "Web", "Embedded", "Games". */
  category: string;
  /** Path under /public, e.g. "/images/projects/my-project.png" */
  thumbnail: string;
  thumbnailAlt: string;
  aspect: "wide" | "square" | "tall";
  description: string;
  /** WHY you made it: the question or curiosity behind the project. */
  inspiration: string;
  technologies: string[];
  role: string;
  status?: ProjectStatus;
  /** Leave undefined until the link is real. */
  repoUrl?: string;
  demoUrl?: string;
}
