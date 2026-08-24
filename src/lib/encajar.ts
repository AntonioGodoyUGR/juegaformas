import { type Pieza } from './dominio'
import { type Azar, type Partida, barajar } from './partida'

/**
 * Las reglas de `encajar`, sin React y sin `@dnd-kit`. Aquí vive lo que decide
 * si una pieza entra en un hueco y cuándo se acaba el tablero; la vista solo
 * traduce dedos a llamadas de este fichero.
 *
 * Dónde cae una pieza soltada no se decide aquí sino en `./cerca`, que es la
 * geometría que `ordenar` también usa.
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
