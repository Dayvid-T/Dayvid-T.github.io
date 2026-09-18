// Project categories shown as accordion cards under "Projects". To add one,
// append an entry here and use its id in a project's `category` front matter.
export const categories = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    blurb: "RAG pipelines, evaluation, and guardrails around LLM apps.",
  },
  {
    id: "cybersec",
    name: "Cyber Security",
    blurb: "Detection, incident response, and hardening.",
  },
  {
    id: "info-management",
    name: "Information Management",
    blurb: "How organizations store, structure, and keep control of their data.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function categoryById(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}
