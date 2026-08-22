# Fundación de rutas: HashRouter y rutas relativas

Status: done

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

- `npm run build` produce un `index.html`, un manifest y un registro de service
  worker sin una sola ruta absoluta
- Servida desde un subdirectorio cualquiera, la aplicación resuelve todos sus
  assets sin reconstruir

## Comments

Corregido un criterio de aceptación que estaba mal escrito: decía "abrir
`dist/index.html` con `file://` carga la aplicación". Eso no puede cumplirse y no
hace falta. Los navegadores bloquean los módulos ES sobre `file://` por CORS,
pase lo que pase con `base`. Y Capacitor tampoco sirve la aplicación por
`file://`: usa `https://localhost` en Android y `capacitor://localhost` en iOS,
que sí son orígenes de verdad. Lo que de verdad hay que garantizar es que no
quede ninguna ruta absoluta, y eso es lo que se comprueba ahora.

Verificado sirviendo `dist/` desde un subdirectorio: `index.html`, favicon, JS,
CSS, manifest, `registerSW.js` y `sw.js` responden todos 200.
