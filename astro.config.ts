import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

import astrowind from './vendor/integration';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',

  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },

  integrations: [
    sitemap(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: [],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
