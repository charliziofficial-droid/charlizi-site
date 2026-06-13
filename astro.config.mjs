import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://charlizi.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    mdx(),
  ],
  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  server: { host: true, port: 4321 },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
