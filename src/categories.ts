// Project categories shown as accordion cards under "Projects". To add one,
// append an entry here and use its id in a project's `category` front matter.
export const categories = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    blurb: "Retrieval, evaluation and guardrails - systems that have to prove they behave.",
  },
  {
    id: "cybersec",
    name: "Cyber Security",
    blurb: "Detection, incident response and hardening at the boundary.",
  },
  {
    id: "info-management",
    name: "Information Management",
    blurb: "How organizations capture, structure and govern their data.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function categoryById(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}
