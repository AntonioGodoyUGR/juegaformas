# Arranque sin conexión

Status: done
Blocked by: 03, 11

El juego tiene que arrancar entero en modo avión después de la primera visita.

## Alcance

- Precache de ilustraciones y sonidos en el service worker
- Verificar que el presupuesto de tamaño del precache cubre todos los assets
- Sin peticiones de red en tiempo de ejecución: no hay telemetría ni fuentes
  remotas

## Hecho cuando

- Con la red desconectada, arrancar desde el icono de la pantalla de inicio
  lleva a un tablero jugable
- El panel de red no registra ninguna petición saliente durante una partida

## Comments

Hecho, y por primera vez en el tracker **comprobado en un navegador de verdad con el
servidor apagado**, no por inferencia.

Lo que se ha escrito no es una revisión del precache: es `herramientas/comprobar-offline.mjs`,
un `postbuild` que corre en cada build local y también en el workflow de Publicar,
que hace `npm run build`. El motivo de que sea una herramienta y no una comprobación
a ojo está en la cabecera del fichero: fallar sin conexión no se nota. La tablet en
la que se juega de verdad está en el salón de una casa con wifi, y el día que un
fichero se quede fuera del precache el juego seguirá funcionando en todas las
pruebas y solo se romperá en el coche. Una regresión así tiene que tumbar la
publicación, no aparecer en la pantalla de un niño.

Seis comprobaciones, y ninguna es decorativa:

- todo lo que se sirve está precacheado
- el precache no promete nada que no exista
- cada fichero aparece una sola vez
- la primera visita cabe en el presupuesto (tope de 3 MiB)
- arrancar desde el icono lleva al juego: `createHandlerBoundToURL("index.html")`
  en el `sw.js` y `registerSW.js` en el `index.html`. Sin lo primero, una URL con
  `#/emparejar/mar` en modo avión no resuelve a nada
- la página no le pide nada a nadie: lista blanca sobre todos los js, css, html y
  el webmanifest, más un barrido de `src` buscando `fetch`, `XMLHttpRequest`,
  `sendBeacon`, `WebSocket` y `EventSource`

Los cuatro dominios de la lista blanca (`www.w3.org`, `react.dev`, `reactrouter.com`,
`localhost`) no se piden: son el espacio de nombres de SVG y URLs dentro de mensajes
de error de las librerías. Están permitidos por nombre para que el día que aparezca
un quinto haya que mirarlo.

El presupuesto por fichero de Workbox (8 MiB) **no se duplica en la herramienta a
propósito**: un fichero que se pase de ese tope simplemente desaparece del manifest,
y eso ya lo caza la primera comprobación. Duplicar el número solo crearía dos sitios
donde cambiarlo.

La herramienta encontró algo el primer día: 16 entradas en el precache para 13
ficheros. `includeAssets` y los iconos del manifest se solapaban con `globPatterns`,
y Workbox deduplica sin quejarse, así que el aviso no llegaba por ningún otro sitio.
Fuera `includeAssets`, `globIgnores: ['icon-*.svg']`, y el manifest queda en 13
entradas reales. Primera visita: 655 KiB contra un tope de 3 MiB. El tope no es un
límite técnico, es lo que se está dispuesto a descargar la primera vez.

Que la comprobación sirve se ha probado dos veces poniendo un fichero de más en
`public/`: sale «fuera del precache» y `npm run build` termina en 1. Los dos
ficheros de prueba están borrados.

La verificación en navegador: build servida en el puerto 4183 (el 4173 estaba
ocupado por el service worker de otro proyecto del usuario, que interceptaba la
navegación y devolvía su propio documento; no se ha desregistrado nada ajeno).
Service worker activado y controlando, 13 entradas cacheadas. Se matan los dos
servidores de preview y un `fetch` confirma «Failed to fetch»: no hay nada
escuchando. Con eso, recargar `#/emparejar/mar` dibuja el tablero entero —título,
botón de volver y las seis cartas del mar— y la partida se completa. El panel de
red registra 11 peticiones, todas a `localhost:4183`, todas 200 y todas servidas
por el service worker: ni una a un origen remoto. Las dos condiciones de hecho, las
dos comprobadas.

No hay ADR nuevo: `docs/adr/0001` ya dice que el juego no lleva telemetría, y esto
no cambia esa decisión, la hace ejecutable.

Verificado: `npm run typecheck`, `npx vitest run` (20 ficheros, 231 tests) y
`npm run build` con su `postbuild` en verde.
