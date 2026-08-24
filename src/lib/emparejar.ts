import { situacion } from './niveles'
import { type Azar, type Partida, barajar } from './partida'

/**
 * Las reglas de `emparejar`, sin React. Aquí vive lo que decide si dos cartas
 * son pareja y cuándo se acaba el tablero.
 *
 * **Boca abajo es un modo, no otra mecánica**, y este fichero es donde eso deja
 * de ser una frase de documentación: el tablero, los toques y el final son los
 * mismos en los dos modos. `bocaAbajo` solo cambia una cosa —si una carta que
 * nadie ha tocado enseña su dibujo— y esa pregunta es `estaVisible`. Si el modo
 * se hubiera hecho con dos tableros distintos, el día que cambie una regla
 * cambiaría en uno solo.
 */

/**
 * Una carta del tablero. Cada pieza pone dos, y por eso la carta necesita
 * identidad propia: el niño toca una carta concreta, no «la pieza cohete».
 */
export type Carta = {
  readonly id: string
  readonly pieza: string
}

export type Tablero = {
  readonly cartas: readonly Carta[]
  /** Si las cartas sin tocar salen ocultas. */
  readonly bocaAbajo: boolean
  /**
   * Las cartas levantadas ahora mismo, como mucho dos. Cuando hay dos es que la
   * pareja ha fallado y está a la vista esperando a que la recoja la vista: son
   * los segundos en los que el niño mira lo que ha salido.
   */
  readonly levantadas: readonly string[]
  /** Las piezas cuya pareja ya está hecha. Se quedan a la vista para siempre. */
  readonly emparejadas: ReadonlySet<string>
}

/** Qué ha pasado al tocar: nada todavía, pareja hecha o pareja fallada. */
export type Toque = 'acierto' | 'fallo' | null

export type Resultado = {
  readonly tablero: Tablero
  readonly toque: Toque
}

/** El identificador de una de las dos cartas de una pieza. */
function cartaDe(pieza: string, copia: number): Carta {
  return { id: `${pieza}#${copia}`, pieza }
}

/**
 * Reparte la partida en cartas: dos por pieza, barajadas juntas. Barajar las
 * dos copias en el mismo sorteo es lo que hace que una pareja pueda salir al
 * lado o en esquinas opuestas.
 */
export function crearTablero(partida: Partida, bocaAbajo: boolean, azar: Azar = Math.random): Tablero {
  const cartas = partida.piezas.flatMap((pieza) => [cartaDe(pieza.id, 1), cartaDe(pieza.id, 2)])

  return {
    cartas: barajar(cartas, azar),
    bocaAbajo,
    levantadas: [],
    emparejadas: new Set(),
  }
}

export function estaEmparejada(tablero: Tablero, pieza: string): boolean {
  return tablero.emparejadas.has(pieza)
}

export function estaLevantada(tablero: Tablero, carta: string): boolean {
  return tablero.levantadas.includes(carta)
}

/**
 * Si el dibujo de una carta se ve. Es lo único que separa los dos modos de
 * emparejar: destapado se ve todo siempre, y boca abajo solo lo que el niño ha
 * tocado o ya ha resuelto.
 */
export function estaVisible(tablero: Tablero, carta: Carta): boolean {
  return !tablero.bocaAbajo || estaLevantada(tablero, carta.id) || estaEmparejada(tablero, carta.pieza)
}

/** Hay una pareja fallada a la vista, esperando a que se recoja. */
export function esperando(tablero: Tablero): boolean {
  return tablero.levantadas.length === 2
}

export function estaTerminado(tablero: Tablero): boolean {
  return tablero.emparejadas.size * 2 === tablero.cartas.length
}

/**
 * Toca una carta.
 *
 * Se ignora el toque —devolviendo el mismo objeto, para que la vista no
 * repinte— cuando no cambia nada: una carta que no existe, una pieza ya
 * emparejada, la carta que ya está levantada, o cualquier toque mientras hay
 * una pareja fallada a la vista. Ese último caso es el importante: sin él, un
 * niño que toca rápido levanta tres cartas y el tablero deja de tener sentido.
 */
export function tocar(tablero: Tablero, carta: string): Resultado {
  const tocada = tablero.cartas.find((c) => c.id === carta)
  const quieto: Resultado = { tablero, toque: null }

  if (!tocada) return quieto
  if (esperando(tablero)) return quieto
  if (estaEmparejada(tablero, tocada.pieza)) return quieto
  if (estaLevantada(tablero, carta)) return quieto

  const [primera] = tablero.levantadas
  if (primera === undefined) {
    return { tablero: { ...tablero, levantadas: [carta] }, toque: null }
  }

  const anterior = tablero.cartas.find((c) => c.id === primera)
  if (anterior?.pieza === tocada.pieza) {
    const emparejadas = new Set(tablero.emparejadas)
    emparejadas.add(tocada.pieza)
    // La pareja hecha sale de `levantadas`: a partir de ahora se ve porque está
    // emparejada, que es un estado del que no se vuelve.
    return { tablero: { ...tablero, levantadas: [], emparejadas }, toque: 'acierto' }
  }

  return { tablero: { ...tablero, levantadas: [primera, carta] }, toque: 'fallo' }
}

/**
 * Recoge la pareja fallada. Lo llama la vista cuando se acaba el rato que las
 * dos cartas se quedan a la vista.
 *
 * Fallar no cuesta nada: no hay intentos, ni marcador, ni sonido. Lo único que
 * pasa es que las cartas vuelven a estar como estaban.
 */
export function recoger(tablero: Tablero): Tablero {
  if (tablero.levantadas.length === 0) return tablero
  return { ...tablero, levantadas: [] }
}

/**
 * A partir de qué partida del nivel se juega boca abajo.
 *
 * El ticket pide que el modo se active «dentro del recorrido del nivel, sin
 * pedírselo al niño»: nadie elige la dificultad, aparece. Las primeras partidas
 * van destapadas porque ahí se aprende el gesto —tocar dos cosas que van
 * juntas—; una vez aprendido, taparlas es lo que lo convierte en un reto.
 */
export const BOCA_ABAJO_DESDE = 5

/**
 * Si toca jugar boca abajo, a partir de las partidas completadas de la
 * mecánica.
 *
 * Se mide dentro del nivel y no sobre el total a propósito: cuando se acaban
 * los niveles y se repite el último, cada vuelta vuelve a empezar con unas
 * cuantas partidas destapadas. Un niño que vuelve al juego después de una
 * semana agradece el calentamiento.
 */
export function juegaBocaAbajo(completadas: number): boolean {
  return situacion('emparejar', completadas).hechas >= BOCA_ABAJO_DESDE
}
