import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          // Cache Google Fonts
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Fashion Freedom Network',
          short_name: 'FFN',
          description: 'The Protocol for Professional Fashion',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      // Raise chunk size warning threshold
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split into many small chunks for better parallelism & caching
          manualChunks(id) {
            // Core React
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'react-vendor';
            }
            // Animation
            if (id.includes('node_modules/framer-motion/')) {
              return 'framer-vendor';
            }
            // Icons
            if (id.includes('node_modules/lucide-react/')) {
              return 'lucide-icons';
            }
            // Supabase
            if (id.includes('node_modules/@supabase/')) {
              return 'database-vendor';
            }
            // PayPal
            if (id.includes('node_modules/@paypal/')) {
              return 'paypal-vendor';
            }
            // Heavy page components — each gets its own chunk
            const heavyPages = [
              'ProfilePage', 'Directory', 'Feed', 'Messaging',
              'Marketplace', 'BrandDashboard', 'MyProfile', 'Castings',
              'Network', 'Explore', 'RegisterProfessional',
            ];
            for (const page of heavyPages) {
              if (id.includes(`components/${page}`)) return `page-${page.toLowerCase()}`;
            }
          },
        },
      },
    },
  };
});
