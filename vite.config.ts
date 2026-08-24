import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
//
// `base` es relativo a propósito. La misma build tiene que servir en tres sitios
// sin recompilar: la raíz de un dominio, el subdirectorio de GitHub Pages
// (https://<usuario>.github.io/juegaformas/) y el `file://` de Capacitor cuando
// empaquetemos para Android e iOS. Esto solo es seguro porque la navegación va
// por `HashRouter`: la parte de ruta de la URL nunca cambia, así que un enlace
// relativo se resuelve igual desde cualquier pantalla del juego.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Sin `includeAssets`: los iconos y el favicon ya entran por
      // `globPatterns`, y ponerlos también ahí los mete dos veces en la lista
      // del precache. Workbox los deduplica sin quejarse, así que el único
      // aviso de que sobraban es `herramientas/comprobar-offline.mjs`.
      workbox: {
        // El juego tiene que arrancar entero en una tablet en modo avión, así que
        // el precache incluye ilustraciones y sonidos, no solo el bundle.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,mp3,ogg}'],
        // Los iconos ya entran en el precache por el manifest, que es quien
        // dice cuáles son. Cogerlos también por el patrón los pone dos veces.
        globIgnores: ['icon-*.svg'],
        // Los assets de un juego infantil pesan; el tope por defecto (2 MiB) se queda corto.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        name: 'JuegaFormas',
        short_name: 'JuegaFormas',
        description: 'Juego de puzzles para niños: encajar, emparejar y ordenar.',
        lang: 'es',
        theme_color: '#7c3aed',
        background_color: '#faf5ff',
        display: 'standalone',
        orientation: 'landscape',
        // Relativos al propio manifest, por el mismo motivo que `base`.
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
