import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every user-facing string is bilingual and lives in the same file, so the
 * build fails if a translation is missing (no silent EN/ES drift).
 */
const bilingual = <T extends z.ZodType>(inner: T) => z.object({ en: inner, es: inner });
const text = bilingual(z.string());
const list = bilingual(z.array(z.string()).min(1));

/** "YYYY-MM" */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');

const profile = defineCollection({
  loader: glob({ pattern: 'profile.yaml', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    nameLines: z.tuple([z.string(), z.string()]),
    jobTitle: text,
    headerRole: text,
    tagline: text,
    /** One-sentence <meta name="description">, ≤ 160 characters. */
    metaDescription: bilingual(z.string().max(160)),
    intro: text,
    about: bilingual(z.array(z.string()).length(3)),
    stats: z
      .array(z.object({ value: text, label: text, source: text }))
      .length(4),
    location: z.object({ label: z.string(), city: z.string(), region: z.string().optional(), countryCode: z.string().length(2), timezone: z.string() }),
    email: z.email(),
    linkedin: z.url(),
    /** Path under /public of the downloadable CV. */
    // Same-origin path only: rejects protocol-relative values like //host/x.pdf.
    cv: z.string().regex(/^\/(?!\/)/),
    knowsAbout: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experience' }),
  schema: z.object({
    order: z.number().int(),
    org: z.string(),
    start: month,
    /** Omit for a current role. */
    end: month.optional(),
    location: z.string(),
    role: text,
    bullets: list,
    tools: list.optional(),
    results: text.optional(),
    open: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/work' }),
  schema: z.object({
    order: z.number().int(),
    title: text,
    client: z.string(),
    year: z.number().int(),
    area: text,
    context: text,
    approach: text,
    /** Label of the third row: "Stack" or "Progress". */
    detailLabel: text,
    stack: text,
    status: text,
    open: z.boolean().default(false),
  }),
});

const expertise = defineCollection({
  loader: file('./src/content/expertise.yaml'),
  schema: z.object({ order: z.number().int(), title: text, items: list, orgs: z.string() }),
});

const education = defineCollection({
  loader: file('./src/content/education.yaml'),
  schema: z.object({ order: z.number().int(), period: text, title: text, institution: z.string(), kind: text }),
});

export const collections = { profile, experience, work, expertise, education };
