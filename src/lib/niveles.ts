import { type Mecanica } from './dominio'

/**
 * Un nivel es un bloque de partidas jugadas con un número de piezas fijo. Es lo
 * único que se desbloquea jugando: los temas están libres desde el primer
 * arranque.
 *
 * `piezas` cuenta piezas **distintas** en el tablero. En `emparejar` eso son
 * parejas, así que un nivel de 3 piezas pinta 6 fichas.
 */
export type Nivel = {
  readonly piezas: number
  readonly partidas: number
}

/**
 * La forma final son tres niveles por mecánica, nueve en total. La v1 entrega
 * el primero de cada una: unas 45 partidas.
 */
export const NIVELES: Readonly<Record<Mecanica, readonly Nivel[]>> = {
  encajar: [{ piezas: 3, partidas: 15 }],
  emparejar: [{ piezas: 3, partidas: 15 }],
  ordenar: [{ piezas: 3, partidas: 15 }],
}

export type Situacion = {
  /** Índice del nivel que se está jugando, desde 0. */
  readonly indice: number
  readonly nivel: Nivel
  /** Partidas ya completadas dentro de este nivel. */
  readonly hechas: number
  /** No quedan niveles nuevos: se sigue jugando el último sin fin. */
  readonly ultimo: boolean
}

/**
 * Dónde está el niño a partir de cuántas partidas lleva completadas en una
 * mecánica. El nivel se deriva, no se guarda: así un progreso a medio escribir
 * o de una versión anterior nunca deja el juego en un estado imposible.
 */
export function situacion(mecanica: Mecanica, completadas: number): Situacion {
  const niveles = NIVELES[mecanica]
  let restantes = Number.isFinite(completadas) ? Math.max(0, Math.trunc(completadas)) : 0

  for (let indice = 0; indice < niveles.length; indice++) {
    const nivel = niveles[indice]
    if (restantes < nivel.partidas) {
      return { indice, nivel, hechas: restantes, ultimo: indice === niveles.length - 1 }
    }
    restantes -= nivel.partidas
  }

  // Se acabaron los niveles. El juego no se cierra ni pone una pantalla de fin:
  // se sigue jugando el último, que es lo que hace un niño que quiere seguir.
  const indice = niveles.length - 1
  const nivel = niveles[indice]
  return { indice, nivel, hechas: restantes % nivel.partidas, ultimo: true }
}

/**
 * Si completar la siguiente partida termina el nivel. Es lo que dispara la
 * celebración grande.
 */
export function completaNivel(mecanica: Mecanica, completadas: number): boolean {
  const actual = situacion(mecanica, completadas)
  return actual.hechas + 1 === actual.nivel.partidas
}
