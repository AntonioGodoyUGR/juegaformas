# Fundación de rutas: HashRouter y rutas relativas

Status: ready-for-agent

Montar `react-router-dom` con `HashRouter` y dejar todas las rutas de assets
relativas, para que la misma build sirva en GitHub Pages y dentro de Capacitor
sin tocar configuración.

## Alcance

- `HashRouter` en `src/main.tsx`
- Rutas: inicio, elección de tema y partida
- Revisar `base` en `vite.config.ts` y el `start_url`/`scope` del manifest para
  que no dependan del subpath `/juegaformas/`
- Mantener la orientación horizontal

## Hecho cuando

- `npm run build` produce un `index.html` cuyos `src`/`href` son relativos
- Abrir el `dist/index.html` con `file://` carga la aplicación
