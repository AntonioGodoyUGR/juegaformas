/**
 * El vocabulario de `CONTEXT.md`, en tipos. Nada de React aquí.
 */

export const MECANICAS = ['encajar', 'emparejar', 'ordenar'] as const
export type Mecanica = (typeof MECANICAS)[number]

/**
 * Los siete temas. Las fronteras no se solapan: un pez es `mar` y nunca
 * `animales`, una bicicleta es `vehiculos` y nunca `deportes`.
 *
 * `vehiculos` va sin tilde porque el identificador viaja en la URL.
 */
export const TEMAS = [
  'espacio',
  'animales',
  'mar',
  'naturaleza',
  'comida',
  'deportes',
  'vehiculos',
] as const
export type Tema = (typeof TEMAS)[number]

/** El objeto ilustrado que el niño manipula. El dibujo lo pone el ticket 03. */
export type Pieza = {
  readonly id: string
  readonly tema: Tema
}

export function esMecanica(valor: unknown): valor is Mecanica {
  return typeof valor === 'string' && (MECANICAS as readonly string[]).includes(valor)
}

export function esTema(valor: unknown): valor is Tema {
  return typeof valor === 'string' && (TEMAS as readonly string[]).includes(valor)
}
