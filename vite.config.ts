import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'offline.html'],
      manifest: {
        name: 'OnlyCation',
        short_name: 'OnlyCation',
        description: 'Plataforma educativa para conectar estudiantes con los mejores profesores',
        theme_color: '#8ED4BE',
        background_color: '#FAF9F5',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Caché de documentos/navegación para funcionar sin conexión (usa precache)
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'html-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
          {
            // API con Background Sync cuando esté sin conexión
            urlPattern: /\/api\//i,
            handler: 'NetworkOnly',
            method: 'POST',
            options: {
              backgroundSync: {
                name: 'onlycation-api-queue',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'offline.html',
      },
    })
  ],
  server: {
    host: 'localhost',
    port: 5173,
    // HTTPS disabled for local development as requested
  },
})
