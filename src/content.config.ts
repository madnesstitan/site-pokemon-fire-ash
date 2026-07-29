// Content collections — the frontmatter contract.
//
// This schema is the single source of truth for what a Sita page may contain.
// It is enforced at build time (build fails on bad data) and mirrored by the
// Python pydantic schema in `sita/schema.py` for a pre-push gate so bad
// frontmatter never reaches a Cloudflare build. The two MUST stay in sync;
// when you change one, change the other.
//
// Bounds intentionally catch garbage (empty / runaway titles, missing dates)
// without breaking a build over a one-character overshoot. The tight SEO
// targets (50–60 char titles, 120–155 descriptions) are writing guidance in
// `skills/post.md`, not hard gates — a brittle build is worse than a 61-char
// title.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pageSchema = z.object({
  title: z.string().min(20).max(72),
  description: z.string().min(80).max(170),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  pageType: z.enum(['home', 'pillar', 'blog', 'comparison', 'how_to', 'legal']),
  heroImage: z.string().optional(),
  keywords: z.array(z.string()).default([]),
});

// `pages` covers home + pillar + comparison + how_to (everything that renders
// at / or /[slug]); `blog` covers blog posts at /blog/[slug]. Same schema,
// separate collections so routing + sitemap groupings stay clean.
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: pageSchema,
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: pageSchema,
});

export const collections = { pages, blog };

export type PageType = z.infer<typeof pageSchema>['pageType'];
export type PageFrontmatter = z.infer<typeof pageSchema>;