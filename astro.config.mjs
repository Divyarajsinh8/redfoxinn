// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://redfoxinnnh.com',
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
});
