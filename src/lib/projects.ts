import { getCollection, type CollectionEntry } from "astro:content";
import { categories, type CategoryId } from "../categories";

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

export interface Series {
  name: string;
  entries: Project[];
}

function groupSeries(projects: Project[]): { series: Series[]; standalone: Project[] } {
  const groups = new Map<string, Project[]>();
  const standalone: Project[] = [];
  for (const project of projects) {
    if (!project.data.series) {
      standalone.push(project);
      continue;
    }
    const list = groups.get(project.data.series) ?? [];
    list.push(project);
    groups.set(project.data.series, list);
  }
  const series = Array.from(groups, ([name, entries]) => ({
    name,
    entries: entries.sort((a, b) => (a.data.phase ?? 0) - (b.data.phase ?? 0)),
  }));
  return { series, standalone };
}

export interface CategoryGroup {
  id: CategoryId;
  name: string;
  blurb: string;
  projects: Project[];
  series: Series[];
  standalone: Project[];
}

export async function projectsByCategory(): Promise<CategoryGroup[]> {
  const projects = await allProjects();
  return categories.map((category) => {
    const mine = projects.filter((p) => p.data.category === category.id);
    return { ...category, projects: mine, ...groupSeries(mine) };
  });
}

export function year(project: Project): string {
  return String(project.data.date.getFullYear());
}
