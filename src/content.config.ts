import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every user-facing string is bilingual and lives in the same file, so the
 * build fails if a translation is missing (no silent EN/ES drift).
 */
const bilingual = <T extends z.ZodType>(inner: T) => z.object({ en: inner, es: inner });

/** "YYYY-MM" */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');

export const profile = defineCollection({
  loader: glob({ pattern: 'profile.yaml', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    jobTitle: bilingual(z.string()),
    /** One-sentence <meta name="description">, ≤ 160 characters. */
    metaDescription: bilingual(z.string().max(160)),
    /** Short intro paragraph shown in the hero. */
    intro: bilingual(z.string()),
    location: z.object({ city: z.string(), region: z.string().optional(), countryCode: z.string().length(2), timezone: z.string() }),
    email: z.email(),
    linkedin: z.url(),
    /** Path under /public of the downloadable CV. */
    cv: z.string().startsWith('/'),
    knowsAbout: z.array(z.string()).default([]),
  }),
});

export const experience = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experience' }),
  schema: z.object({
    org: z.string(),
    start: month,
    /** Omit for a current role: drives the "present" marker and the timeline. */
    end: month.optional(),
    location: z.string(),
    role: bilingual(z.string()),
    bullets: bilingual(z.array(z.string()).min(1)),
    tools: z.array(z.string()).default([]),
    /** Optional headline figures for the role. */
    metrics: z
      .array(z.object({ label: bilingual(z.string()), value: bilingual(z.string()) }))
      .default([]),
    /** Roles listed in the highlighted strip of the profile section. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { profile, experience };
