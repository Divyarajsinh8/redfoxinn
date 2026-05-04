// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://redfoxinnnh.com',

  // Legacy routes — keep external links + bookmarks alive after the rename
  redirects: {
    '/bar': '/the-den',
    '/lounge': '/the-dusk',
  },

  integrations: [
    sanity({
      projectId: 'ug6dnpcr',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2024-03-12',
      studioBasePath: '/studio',
    }),
    react(),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});