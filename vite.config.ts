import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'https://alcoceba.github.io/brandt-daroff';
  let basePath = '/';
  try {
    const url = new URL(siteUrl);
    const path = url.pathname.replace(/\/+$/, '');
    basePath = path ? `${path}/` : '/';
  } catch {
    basePath = '/brandt-daroff/';
  }

  return {
    base: basePath,
  plugins: [
    {
      name: 'serve-static-info-pages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] || '';
          const match = url.match(/(?:\/brandt-daroff)?\/info\/(ca|es|en)\/?$/);
          if (match) {
            if (!url.endsWith('/')) {
              res.writeHead(301, { Location: `${url}/` });
              res.end();
              return;
            }
            const lang = match[1];
            const filePath = path.resolve(process.cwd(), 'public', 'info', lang, 'index.html');
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(filePath, 'utf-8'));
              return;
            }
          }
          next();
        });
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Brandt-Daroff — VPPB Home Treatment',
        short_name: 'Brandt-Daroff',
        description: 'Guides patients through Brandt-Daroff exercises for BPPV at home.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webmanifest}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
};
});
