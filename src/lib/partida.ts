import { type Dificultad, type Mecanica, type Pieza, type Tema } from './dominio'
import { piezasDeNivel } from './niveles'
import { piezasDe } from './piezas'

/** Un tablero listo para jugar. */
export type Partida = {
  readonly mecanica: Mecanica
  readonly tema: Tema
  readonly piezas: readonly Pieza[]
}

/** Una fuente de azar inyectable, para que los tests sean deterministas. */
export type Azar = () => number

/** Fisher-Yates sobre una copia; el original no se toca. */
export function barajar<T>(items: readonly T[], azar: Azar = Math.random): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/**
 * Genera el tablero que le toca al niño: el número de piezas lo pone la
 * dificultad elegida para esa mecánica, y las piezas salen del tema elegido sin
 * repetirse dentro del tablero.
 *
 * Si el tema tuviera menos piezas de las que pide la dificultad, se juega con
 * las que hay. Un tablero pequeño es un fallo de contenido molesto; un tablero
 * con la misma pieza dos veces rompe `encajar` y `emparejar`.
 */
export function generarPartida(
  mecanica: Mecanica,
  tema: Tema,
  dificultad: Dificultad,
  azar: Azar = Math.random,
): Partida {
  const disponibles = piezasDe(tema)
  const cuantas = Math.min(piezasDeNivel(mecanica, dificultad), disponibles.length)

  return {
    mecanica,
    tema,
    piezas: barajar(disponibles, azar).slice(0, cuantas),
  }
}
