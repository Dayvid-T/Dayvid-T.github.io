import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export const STATUS_LABEL: Record<Project["data"]["status"], string> = {
  maintained: "Actively maintained",
  complete: "Complete",
  "in-progress": "In progress",
  planned: "Planned",
};

export async function allProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) return b.data.order - a.data.order;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export async function featuredProjects(): Promise<Project[]> {
  const projects = await allProjects();
  const featured = projects.filter((p) => p.data.featured);
  return featured.length ? featured : projects.slice(0, 3);
}

export interface Series {
  name: string;
  entries: Project[];
}

export async function seriesList(): Promise<Series[]> {
  const projects = await allProjects();
  const groups = new Map<string, Project[]>();
  for (const project of projects) {
    if (!project.data.series) continue;
    const list = groups.get(project.data.series) ?? [];
    list.push(project);
    groups.set(project.data.series, list);
  }
  return Array.from(groups, ([name, entries]) => ({
    name,
    entries: entries.sort((a, b) => (a.data.phase ?? 0) - (b.data.phase ?? 0)),
  }));
}

export function year(project: Project): string {
  return String(project.data.date.getFullYear());
}
