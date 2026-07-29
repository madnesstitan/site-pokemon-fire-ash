import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { siteUrl } from './site.config.ts';

// The deployed URL is required by @astrojs/sitemap and feeds the canonical
// URLs emitted by BaseLayout. Reading it from site.config.ts keeps a single
// source of truth for the domain.
export default defineConfig({
  site: siteUrl,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
  markdown: {
    shikiConfig: {
      // Theme-agnostic syntax highlighting: light + dark variants pick up CSS
      // variables via the `cssVariables` preset so code blocks match the theme.
      theme: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});