import { type Dificultad, type Mecanica } from './dominio'

/**
 * Cuántas piezas **distintas** pone en el tablero cada dificultad, mecánica a
 * mecánica. En `emparejar` son parejas, así que tres piezas pintan seis fichas.
 *
 * Los números no son los mismos en las tres porque el mismo número de piezas no
 * cuesta lo mismo en cada una: seis huecos en `encajar` son seis decisiones
 * independientes, y seis eslabones en `ordenar` son una escalera de seis
 * peldaños que hay que comparar entre sí —y que además no cabe en una tablet sin
 * dejar el peldaño pequeño del tamaño de una uña—. Ninguna pasa de seis: seis
 * son las piezas que tiene un tema, y repetir una rompería `encajar` y
 * `emparejar`.
 */
export const PIEZAS_POR_DIFICULTAD: Readonly<
  Record<Mecanica, Readonly<Record<Dificultad, number>>>
> = {
  encajar: { facil: 3, media: 4, dificil: 6 },
  emparejar: { facil: 3, media: 4, dificil: 6 },
  ordenar: { facil: 3, media: 4, dificil: 5 },
}

/** Cuántas piezas reparte un tablero de esta mecánica en esta dificultad. */
export function piezasDeNivel(mecanica: Mecanica, dificultad: Dificultad): number {
  return PIEZAS_POR_DIFICULTAD[mecanica][dificultad]
}

/** La mayor cantidad de piezas que puede llegar a pedir un tablero. */
export const PIEZAS_MAXIMAS = Math.max(
  ...Object.values(PIEZAS_POR_DIFICULTAD).flatMap((porDificultad) => Object.values(porDificultad)),
)

/**
 * Un nivel es un bloque de partidas seguidas que termina en celebración grande.
 *
 * Ya no dice de qué tamaño es el tablero: eso lo elige un adulto en la pantalla
 * de la mecánica y vive en `PIEZAS_POR_DIFICULTAD`. Lo que el nivel sigue
 * gobernando es el ritmo —cada cuántas partidas hay premio— y el calentamiento
 * de `emparejar`, que se mide dentro del nivel.
 */
export type Nivel = {
  readonly partidas: number
}

/**
 * Un bloque por mecánica, de quince partidas. Se deja como lista y no como un
 * número suelto porque el día que un bloque dure distinto que el anterior
 * —quince, luego veinte— el cambio es añadir una entrada aquí.
 */
export const NIVELES: Readonly<Record<Mecanica, readonly Nivel[]>> = {
  encajar: [{ partidas: 15 }],
  emparejar: [{ partidas: 15 }],
  ordenar: [{ partidas: 15 }],
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
