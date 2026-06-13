import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://charlizi.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    icon(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'astrowind:config': './src/mocks/astrowind-config.js',
      },
    },
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
