import { Pieza } from '../piezas'
import { Chispa } from '../piezas/chispa'
import { DETALLE, PALETA, TRAZO } from '../piezas/estilo'

/**
 * El fondo de todas las pantallas: cielo, estrellas y el horizonte del planeta.
 *
 * Es una sola escena y no un decorado por pantalla porque el juego cuenta que
 * estás en un sitio, y el sitio no cambia entre el menú y el tablero: lo que
 * cambia es cuánto se ve del suelo. `banda` es eso, y nada más.
 *
 * El horizonte está hecho con CSS y no con un SVG. Un `path` con la curva
 * dibujada tiene un ancho fijo, y en apaisado el ancho va de 667 a 1366: al
 * estirarlo los cráteres redondos se vuelven óvalos, y al recortarlo se pierde
 * la curva. Un borde redondeado elíptico se adapta solo y los cráteres, que son
 * hijos aparte, siguen redondos a cualquier ancho.
 *
 * Todo esto es decorado: no lleva texto, no recibe toques y está escondido del
 * lector de pantalla entero.
 */

/** Las coordenadas de abajo están tomadas sobre una tablet apaisada. */
const ANCHO = 1024
const ALTO = 768

/** Altura del suelo en el centro, en porcentaje de la pantalla. */
const BANDAS = {
  /** El menú: se ve el borde del planeta y poco más. */
  baja: 19,
  /** La celebración: el suelo sube para que la mascota se apoye en él. */
  media: 24,
  /** El tablero: las fichas descansan sobre el suelo. */
  alta: 28,
} as const

export type Banda = keyof typeof BANDAS

/**
 * Estrellas de cuatro puntas y puntos sueltos. Las posiciones están escogidas a
 * mano, no repartidas al azar: ninguna cae donde va un título, un botón o la
 * fila de fichas, porque una estrella detrás de una palabra la hace más difícil
 * de leer justo para quien menos lee.
 */
const CHISPAS = [
  [86, 92, 26],
  [598, 44, 16],
  [332, 128, 12],
  [498, 46, 20],
  [668, 106, 14],
  [826, 58, 24],
  [944, 148, 16],
  [58, 268, 14],
  [968, 292, 20],
  [148, 402, 12],
] as const

const PUNTOS = [
  [268, 196, 6],
  [420, 96, 5],
  [556, 110, 6],
  [742, 40, 5],
  [900, 226, 6],
  [104, 176, 5],
  [66, 336, 5],
] as const

/**
 * El suelo es más ancho que la pantalla para que la curva del horizonte entre y
 * salga por los lados en vez de morir dentro. `overflow-hidden` se lleva lo que
 * sobra, los bordes laterales incluidos, y el inferior se va 12px por debajo:
 * así el contorno solo se ve donde tiene sentido, que es arriba.
 */
const ANCHO_SUELO = 120
const DESBORDE = (ANCHO_SUELO - 100) / 2

/** Cráteres: posición horizontal, hondura dentro de la banda y diámetro. */
const CRATERES = [
  [196, 0.45, 52],
  [852, 0.35, 36],
  [560, 0.7, 26],
] as const

/** De coordenada de pantalla a porcentaje dentro del suelo, que es más ancho. */
function enSuelo(x: number) {
  return ((x / ANCHO) * 100 + DESBORDE) / (ANCHO_SUELO / 100)
}

/** Lo mismo para un tamaño, que no lleva el desplazamiento del desbordamiento. */
function anchoEnSuelo(d: number) {
  return ((d / ANCHO) * 100) / (ANCHO_SUELO / 100)
}

/**
 * El cohete cruzando el cielo con su estela. Va donde no hay nada que tocar
 * —arriba a la derecha— y solo en las pantallas que tienen ese hueco libre: en
 * el tablero ahí está el selector de dificultad.
 *
 * La estela es un trazo blanco a puntos y no una línea entera: una línea uniría
 * dos cosas, y aquí lo que hace falta es que se note que el cohete venía de
 * algún sitio.
 */
function Cohete() {
  return (
    <div className="absolute top-[6%] right-[2%] aspect-square w-[42%]">
      <svg viewBox="0 0 256 256" className="absolute inset-0" aria-hidden="true" focusable="false">
        <path
          d="M20 236 C 90 210 130 150 170 78"
          fill="none"
          stroke={PALETA.blanco}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="0.1 24"
        />
      </svg>
      <div className="absolute top-[4%] right-[6%] w-[34%] rotate-[-25deg]">
        <Pieza id="espacio/cohete" decorativa />
      </div>
    </div>
  )
}

export function Escenario({ banda, cohete = false }: { banda: Banda; cohete?: boolean }) {
  const alto = BANDAS[banda]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {CHISPAS.map(([x, y, tam]) => (
        <div
          key={`${x},${y}`}
          className="absolute"
          style={{
            left: `${(x / ANCHO) * 100}%`,
            top: `${(y / ALTO) * 100}%`,
            width: `${(tam / ANCHO) * 100}%`,
          }}
        >
          <Chispa className="w-full" />
        </div>
      ))}
      {cohete ? <Cohete /> : null}
      {PUNTOS.map(([x, y, d]) => (
        <div
          key={`${x},${y}`}
          className="absolute rounded-full bg-tenue"
          style={{
            left: `${(x / ANCHO) * 100}%`,
            top: `${(y / ALTO) * 100}%`,
            width: d,
            height: d,
          }}
        />
      ))}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-suelo"
        style={{
          width: `${ANCHO_SUELO}%`,
          height: `calc(${alto}% + 12px)`,
          bottom: -12,
          border: `8px solid ${TRAZO}`,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        }}
      >
        {CRATERES.map(([x, hondura, diametro]) => (
          <div
            key={x}
            className="absolute rounded-full"
            style={{
              left: `${enSuelo(x)}%`,
              top: `${hondura * 100}%`,
              width: `${anchoEnSuelo(diametro)}%`,
              aspectRatio: '1',
              background: PALETA.morado,
              border: `${DETALLE}px solid ${TRAZO}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
