import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { categoryIds } from "./categories";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    category: z.enum(categoryIds),
    tags: z.array(z.string()).default([]),
    status: z.enum(["maintained", "complete", "in-progress", "planned"]).default("complete"),
    series: z.string().optional(),
    phase: z.number().int().positive().optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    frameLabel: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { projects };
