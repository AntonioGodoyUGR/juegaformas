import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// `base` apunta al subdirectorio de GitHub Pages: https://<usuario>.github.io/juegaformas/
export default defineConfig({
  base: '/juegaformas/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // El juego tiene que arrancar entero en una tablet en modo avión, así que
        // el precache incluye ilustraciones y sonidos, no solo el bundle.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,mp3,ogg}'],
        // Los assets de un juego infantil pesan; el tope por defecto (2 MiB) se queda corto.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        name: 'JuegaFormas',
        short_name: 'JuegaFormas',
        description: 'Juego de puzzles para niños: encajar, parejas, memoria y ordenar.',
        lang: 'es',
        theme_color: '#7c3aed',
        background_color: '#faf5ff',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/juegaformas/',
        scope: '/juegaformas/',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
