import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    companyUrl: z.string().optional(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
  }),
});

const resume = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/resume" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, work, projects, resume };
