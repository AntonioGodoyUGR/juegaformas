/**
 * Comprueba que lo que hay en `dist/` arranca en modo avión.
 *
 * Se ejecuta solo, después de cada `npm run build` (mira el `postbuild` del
 * `package.json`), y por eso también en el flujo que publica. La razón de que
 * sea parte de la build y no una comprobación aparte es que fallar sin conexión
 * no se nota: la tablet en la que se juega de verdad está en el salón de una
 * casa con wifi, y el día que un fichero se quede fuera del precache el juego
 * seguirá funcionando en todas las pruebas y solo se romperá en el coche.
 *
 * Lo que no comprueba: cómo se ve. Esto lee ficheros, no abre un navegador.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'

const DIST = 'dist'

/**
 * Cuánto puede pesar la primera visita. No es un límite técnico —el precache
 * aguanta mucho más—: es lo que se descarga de una sentada la primera vez que
 * un niño abre el juego, y con una conexión de móvil tres megas ya son una
 * pantalla en blanco lo bastante larga como para que alguien cierre la pestaña.
 */
const TOPE_TOTAL = 3 * 1024 * 1024

/**
 * Los únicos sitios de internet que el bundle puede mencionar, y ninguno se
 * pide. `www.w3.org` es el espacio de nombres de los SVG, que es un
 * identificador y no una dirección; los otros tres son texto dentro de mensajes
 * de error de React y de React Router, y `localhost` es la base con la que
 * React Router parsea una URL cuando el origen es `null`, que es justo lo que
 * pasa dentro de `file://`.
 *
 * Cualquier otro dominio que aparezca aquí es una fuente remota, una CDN o
 * telemetría que se ha colado con una dependencia, y todas ellas convierten el
 * juego en algo que necesita conexión.
 */
const DOMINIOS_PERMITIDOS = new Set(['www.w3.org', 'react.dev', 'reactrouter.com', 'localhost'])

/**
 * El service worker y lo que importa no se precachean a sí mismos: el navegador
 * los guarda aparte, al registrar, y por eso están offline sin aparecer en la
 * lista.
 */
function esMaquinariaDelServiceWorker(fichero) {
  return fichero === 'sw.js' || /^workbox-[0-9a-f]+\.js$/.test(fichero)
}

/**
 * Las rutas se montan a mano con barras normales en vez de con `path.join`
 * porque no son rutas del sistema de ficheros: son las claves del precache, y
 * el service worker las pide igual desde una tablet que desde el Windows en el
 * que se ha construido. Con `join` saldrían con barra invertida y ningún
 * fichero cuadraría con su entrada.
 */
function ficherosDe(carpeta = '', prefijo = '') {
  return readdirSync(`${DIST}/${carpeta}`, { withFileTypes: true }).flatMap((entrada) => {
    const dentro = `${prefijo}${entrada.name}`
    return entrada.isDirectory() ? ficherosDe(`${carpeta}${entrada.name}/`, `${dentro}/`) : [dentro]
  })
}

function textoDe(fichero) {
  return readFileSync(`${DIST}/${fichero}`, 'utf8')
}

const fallos = []
function comprobar(que, problemas) {
  const rotos = problemas()
  if (rotos.length === 0) {
    console.log(`  ok  ${que}`)
    return
  }
  fallos.push(que)
  console.log(`  NO  ${que}`)
  for (const roto of rotos) console.log(`      ${roto}`)
}

let servidos
let sw
try {
  servidos = ficherosDe('').filter((fichero) => !esMaquinariaDelServiceWorker(fichero))
  sw = textoDe('sw.js')
} catch {
  console.error('No hay build que comprobar: ejecuta `npm run build`.')
  process.exit(1)
}

// La lista viene minificada, así que se lee con una expresión regular en vez de
// evaluándola. Si un día deja de encontrar entradas, es que Workbox ha cambiado
// de formato: eso también es un fallo, y sale abajo como «nada precacheado».
const precacheados = [...sw.matchAll(/\{url:"([^"]+)"/g)].map((encontrado) => encontrado[1])
const enPrecache = new Set(precacheados)

const kib = (bytes) => `${(bytes / 1024).toFixed(0)} KiB`
const total = servidos.reduce((suma, f) => suma + statSync(`${DIST}/${f}`).size, 0)

console.log(
  `\nSin conexión: ${servidos.length} ficheros, ${kib(total)}, ${enPrecache.size} en el precache`,
)

comprobar('todo lo que se sirve está precacheado', () =>
  // Un fichero que se queda fuera no da error al construir: da un hueco en la
  // pantalla el día que no hay red. El caso típico es un formato nuevo que no
  // está en `globPatterns`, o un fichero por encima del tope por tamaño.
  servidos.filter((fichero) => !enPrecache.has(fichero)).map((f) => `fuera del precache: ${f}`),
)

comprobar('el precache no promete nada que no exista', () =>
  [...enPrecache]
    .filter((url) => !servidos.includes(url))
    .map((url) => `precacheado pero no está en dist: ${url}`),
)

comprobar('cada fichero aparece una sola vez', () => {
  const vistos = new Set()
  return precacheados
    .filter((url) => (vistos.has(url) ? true : (vistos.add(url), false)))
    .map((url) => `repetido: ${url}`)
})

comprobar('la primera visita cabe en el presupuesto', () =>
  total <= TOPE_TOTAL ? [] : [`${kib(total)}, y el tope está en ${kib(TOPE_TOTAL)}`],
)

comprobar('arrancar desde el icono lleva al juego', () => {
  const roto = []
  // Sin esto, abrir la aplicación instalada sin red no encuentra documento que
  // servir: el precache está lleno y la pantalla, en blanco.
  if (!sw.includes('createHandlerBoundToURL("index.html")')) {
    roto.push('el service worker no responde a las navegaciones con index.html')
  }
  if (!textoDe('index.html').includes('registerSW.js')) {
    roto.push('index.html no registra el service worker, así que no hay segunda visita')
  }
  return roto
})

comprobar('la página no le pide nada a nadie', () =>
  servidos
    .filter((f) => /\.(js|css|html|webmanifest)$/.test(f))
    .flatMap((f) =>
      [...textoDe(f).matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)]
        .map((encontrado) => encontrado[1])
        .filter((dominio) => !DOMINIOS_PERMITIDOS.has(dominio))
        .map((dominio) => `${f} menciona ${dominio}`),
    ),
)

comprobar('el juego no abre conexiones', () => {
  // Del código propio, que es el único que podemos arreglar. Ninguna de estas
  // funciona en modo avión, así que cualquiera de ellas en una partida es una
  // pantalla parada esperando algo que no va a llegar.
  const fuentes = (carpeta) =>
    readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
      const ruta = `${carpeta}/${entrada.name}`
      if (entrada.isDirectory()) return fuentes(ruta)
      return /\.tsx?$/.test(entrada.name) && !entrada.name.includes('.test.') ? [ruta] : []
    })

  return fuentes('src')
    .flatMap((ruta) =>
      readFileSync(ruta, 'utf8')
        .split('\n')
        .map((linea, i) => [linea, i + 1])
        .filter(([linea]) => /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource)\s*\(/.test(linea))
        .map(([, numero]) => `${ruta}:${numero}`),
    )
    .map((sitio) => `pide algo por red: ${sitio}`)
})

if (fallos.length > 0) {
  console.log(`\nEsta build no arranca sin conexión: ${fallos.length} comprobación(es) rota(s).\n`)
  process.exit(1)
}
console.log('')
