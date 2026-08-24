import { type Pieza } from './dominio'
import { type Azar, type Partida, barajar } from './partida'

/**
 * Las reglas de `encajar`, sin React y sin `@dnd-kit`. Aquí vive lo que decide
 * si una pieza entra en un hueco y cuándo se acaba el tablero; la vista solo
 * traduce dedos a llamadas de este fichero.
 *
 * El motivo de separarlo es la tolerancia: «cerca es suficiente» es una regla
 * de geometría con un número dentro, y un número que decide si un niño de cinco
 * años acierta o falla tiene que poder probarse sin montar un navegador.
 */

/**
 * El tablero de una partida de encajar.
 *
 * `huecos` y `fichas` son la misma lista de piezas en dos órdenes distintos, y
 * ninguno de los dos cambia mientras se juega: `encajadas` dice cuáles ya están
 * puestas. Se hace así, y no sacando la pieza de `fichas`, porque si la bandeja
 * se recoloca al acertar, la siguiente pieza que el niño iba a coger se le mueve
 * debajo del dedo.
 */
export type Tablero = {
  readonly huecos: readonly Pieza[]
  readonly fichas: readonly Pieza[]
  readonly encajadas: ReadonlySet<string>
}

/** Lo que devuelve soltar una pieza: el tablero nuevo y si la pieza entró. */
export type Resultado = {
  readonly tablero: Tablero
  readonly acierto: boolean
}

/**
 * Reparte la partida en huecos y fichas. Los dos órdenes salen barajados por
 * separado, y si aun así coinciden se rota uno: con los huecos arriba y las
 * fichas debajo en el mismo orden, el tablero se resuelve subiendo el dedo en
 * línea recta tres veces y deja de ser un puzzle.
 */
export function crearTablero(partida: Partida, azar: Azar = Math.random): Tablero {
  const huecos = partida.piezas
  let fichas = barajar(huecos, azar)

  if (huecos.length > 1 && fichas.every((ficha, i) => ficha.id === huecos[i].id)) {
    fichas = [...fichas.slice(1), fichas[0]]
  }

  return { huecos, fichas, encajadas: new Set() }
}

export function estaEncajada(tablero: Tablero, pieza: string): boolean {
  return tablero.encajadas.has(pieza)
}

export function estaTerminado(tablero: Tablero): boolean {
  return tablero.encajadas.size === tablero.huecos.length
}

/**
 * Suelta una pieza sobre un hueco. `hueco` es `null` cuando se ha soltado lejos
 * de todos, que para el juego es lo mismo que soltarla en el equivocado.
 *
 * Fallar no cuesta nada: no hay intentos, ni marcador, ni bloqueo. El tablero
 * vuelve tal cual estaba —el mismo objeto, para que la vista no repinte— y lo
 * único que cambia es que `acierto` viene en `false`, que es lo que la vista
 * usa para devolver la pieza a su sitio.
 */
export function soltar(tablero: Tablero, pieza: string, hueco: string | null): Resultado {
  if (hueco === null || hueco !== pieza || estaEncajada(tablero, pieza)) {
    return { tablero, acierto: false }
  }

  const encajadas = new Set(tablero.encajadas)
  encajadas.add(pieza)
  return { tablero: { ...tablero, encajadas }, acierto: true }
}

/** Un rectángulo en coordenadas de pantalla, con el origen arriba a la izquierda. */
export type Recuadro = {
  readonly x: number
  readonly y: number
  readonly ancho: number
  readonly alto: number
}

/** Un hueco del tablero con el sitio que ocupa en pantalla. */
export type Diana = {
  readonly id: string
  readonly recuadro: Recuadro
}

/**
 * Cuánto se le perdona al niño, en proporción al tamaño del hueco. A 0.6, una
 * pieza que se queda a más de media casilla de distancia no cuenta.
 *
 * Va en proporción y no en píxeles a propósito: el mismo tablero se juega en
 * una tablet de 10 pulgadas y en la ventana de un portátil, y la puntería de un
 * dedo de cinco años se mide en anchos de casilla, no en píxeles.
 */
export const TOLERANCIA = 0.6

/** La separación entre dos recuadros. Cero si se tocan o se solapan. */
function separacion(a: Recuadro, b: Recuadro): number {
  const dx = Math.max(0, a.x - (b.x + b.ancho), b.x - (a.x + a.ancho))
  const dy = Math.max(0, a.y - (b.y + b.alto), b.y - (a.y + a.alto))
  return Math.hypot(dx, dy)
}

function distanciaDeCentros(a: Recuadro, b: Recuadro): number {
  return Math.hypot(a.x + a.ancho / 2 - (b.x + b.ancho / 2), a.y + a.alto / 2 - (b.y + b.alto / 2))
}

/**
 * El hueco al que va una pieza soltada, o `null` si se ha soltado lejos de
 * todos.
 *
 * Vale con acercarse: un hueco entra en el sorteo si la pieza lo solapa o si se
 * queda a menos de `TOLERANCIA` de él. Entre los que entran gana el de centro
 * más cercano, para que soltar entre dos huecos pegados no sea una moneda al
 * aire.
 *
 * Que devuelva `null` es lo que mantiene el fallo posible. Sin ese caso, la
 * pieza siempre encontraría hueco y la mecánica se resolvería sola.
 */
export function huecoMasCercano(arrastrada: Recuadro, huecos: readonly Diana[]): string | null {
  let elegido: string | null = null
  let mejor = Infinity

  for (const hueco of huecos) {
    const margen = Math.min(hueco.recuadro.ancho, hueco.recuadro.alto) * TOLERANCIA
    if (separacion(arrastrada, hueco.recuadro) > margen) continue

    const distancia = distanciaDeCentros(arrastrada, hueco.recuadro)
    if (distancia < mejor) {
      mejor = distancia
      elegido = hueco.id
    }
  }

  return elegido
}
