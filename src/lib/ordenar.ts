import { type Azar, type Partida, barajar } from './partida'

/**
 * Las reglas de `ordenar`: el niño coloca varias piezas en una secuencia
 * correcta.
 *
 * Dos cosas gobiernan este fichero.
 *
 * La primera es el ADR de la progresión: los dibujos no llevan atributos de
 * dificultad. Ninguna de las cuarenta y dos piezas sabe si es «grande» o
 * «pequeña», así que el criterio de la secuencia no se lee de la pieza, se le
 * aplica: la misma pieza dibujada a tamaños que crecen, o repetida un número de
 * veces que crece. Por eso una partida de ordenar tiene una sola pieza
 * protagonista.
 *
 * La segunda es el vocabulario: aquí se habla de **inicio** y **fin**, nunca de
 * izquierda y derecha. El grado 1 es el inicio y el grado más alto es el fin; a
 * qué lado de la pantalla cae cada uno es cosa de la vista, y en árabe caerá al
 * revés sin que estas reglas se enteren.
 */

/**
 * Qué es lo que crece de un eslabón al siguiente.
 *
 * No hay un tercer criterio por etapas de un proceso —una semilla, un brote,
 * una flor— porque eso pide dibujos que no existen: el catálogo son cuarenta y
 * dos piezas sueltas, no series. Ese criterio entra cuando entren sus dibujos.
 */
export type Criterio = 'tamano' | 'cantidad'

/** Los criterios en el orden en que se turnan. */
export const CRITERIOS: readonly Criterio[] = ['tamano', 'cantidad']

/**
 * Un eslabón de la secuencia: la pieza protagonista con su grado.
 *
 * El grado es a la vez lo que se ve —cuánto mide, o cuántas hay— y el sitio que
 * le toca. Van juntos a propósito: es lo que hace que la solución sea única.
 */
export type Eslabon = {
  readonly grado: number
  readonly id: string
}

/**
 * El tablero de una partida de ordenar.
 *
 * `eslabones` es la bandeja, en el orden en que se le ofrecen al niño, y no
 * cambia mientras se juega: `colocados` dice cuáles ya están puestos. Igual que
 * en `encajar`, y por el mismo motivo: si la bandeja se recoloca al acertar, el
 * eslabón que el niño iba a coger se le mueve debajo del dedo.
 */
export type Tablero = {
  readonly pieza: string
  readonly criterio: Criterio
  readonly eslabones: readonly Eslabon[]
  readonly colocados: ReadonlySet<number>
}

/** Lo que devuelve soltar un eslabón: el tablero nuevo y si el eslabón entró. */
export type Resultado = {
  readonly tablero: Tablero
  readonly acierto: boolean
}

/** El grado por el que empieza la secuencia. */
export const INICIO = 1

/**
 * Monta la secuencia a partir de una partida.
 *
 * De la partida se usan dos cosas: la primera pieza, que es la protagonista, y
 * cuántas piezas trae, que es lo que dice cuán larga es la secuencia. Las demás
 * piezas se ignoran, y eso es deliberado: `generarPartida` reparte tantas piezas
 * como diga el nivel, y aquí ese número se gasta en eslabones en vez de en
 * dibujos distintos. Así el nivel sigue siendo el único mando de la dificultad
 * sin que `generarPartida` tenga que saber nada de esta mecánica.
 *
 * La bandeja sale barajada, y si el sorteo la deja ya ordenada se rota: una
 * secuencia que empieza resuelta no es una secuencia.
 */
export function crearTablero(
  partida: Partida,
  criterio: Criterio,
  azar: Azar = Math.random,
): Tablero {
  const pieza = partida.piezas[0].id
  const grados = partida.piezas.map((_, i) => INICIO + i)

  let eslabones: Eslabon[] = barajar(grados, azar).map((grado) => ({
    grado,
    id: `${pieza}#${grado}`,
  }))

  if (eslabones.length > 1 && eslabones.every((eslabon, i) => eslabon.grado === grados[i])) {
    eslabones = [...eslabones.slice(1), eslabones[0]]
  }

  return { pieza, criterio, eslabones, colocados: new Set() }
}

/** Los sitios de la secuencia, del inicio al fin. */
export function secuencia(tablero: Tablero): readonly number[] {
  return tablero.eslabones.map((_, i) => INICIO + i)
}

export function estaColocado(tablero: Tablero, grado: number): boolean {
  return tablero.colocados.has(grado)
}

export function estaTerminado(tablero: Tablero): boolean {
  return tablero.colocados.size === tablero.eslabones.length
}

/**
 * Suelta un eslabón sobre un sitio. `sitio` es `null` cuando se ha soltado lejos
 * de todos, que para el juego es lo mismo que soltarlo en el equivocado.
 *
 * «Colocar en el sitio equivocado devuelve la pieza en silencio»: el tablero
 * vuelve tal cual estaba —el mismo objeto, para que la vista no repinte— y lo
 * único que cambia es que `acierto` viene en `false`. No hay intentos, ni aviso,
 * ni sitio que se quede ocupado por una pieza que no era.
 */
export function soltar(tablero: Tablero, grado: number, sitio: number | null): Resultado {
  if (sitio === null || sitio !== grado || estaColocado(tablero, grado)) {
    return { tablero, acierto: false }
  }

  const colocados = new Set(tablero.colocados)
  colocados.add(grado)
  return { tablero: { ...tablero, colocados }, acierto: true }
}

/**
 * Con qué criterio se juega la siguiente partida.
 *
 * Se turnan partida a partida en vez de sortearse para que los dos salgan
 * siempre, y para que dos tableros seguidos no sean el mismo ejercicio. Va con
 * las partidas completadas por el mismo motivo que el modo boca abajo de
 * `emparejar`: nadie le pregunta al niño a qué quiere jugar.
 */
export function criterioDe(completadas: number): Criterio {
  const hechas = Math.max(0, Math.trunc(completadas))
  return CRITERIOS[hechas % CRITERIOS.length]
}
