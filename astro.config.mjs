import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://charlizi.com',
  integrations: [sitemap(), mdx()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
  server: { host: true, port: 4321 }
});
