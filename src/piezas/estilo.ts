/**
 * El sistema de estilo de las piezas. Es cerrado a propósito: cuantas menos
 * decisiones queden abiertas, más se parecen entre sí cuarenta y dos dibujos
 * hechos en sesiones distintas.
 *
 * Las reglas:
 *
 * - Lienzo cuadrado de 256, siempre. La pieza vive dentro de un margen de 24
 *   para que el trazo no se coma en los bordes al escalarla.
 * - Relleno plano. Ningún degradado, ninguna sombra, ninguna transparencia.
 * - Un solo grosor de trazo, un solo color de trazo, esquinas y puntas
 *   redondeadas. Es lo que hace que un cohete y una manzana parezcan del mismo
 *   juego.
 * - Seis colores y blanco. Si un dibujo necesita un séptimo, el dibujo está mal
 *   planteado, no la paleta.
 *
 * Las piezas se leen a 96px de lado en una tablet, así que nada de detalles por
 * debajo de unos 16 de lienzo: a ese tamaño desaparecen.
 */

export const LIENZO = 256
export const GROSOR = 8
export const TRAZO = '#2f2a3d'

export const PALETA = {
  rojo: '#ef4757',
  naranja: '#ff9f43',
  amarillo: '#ffd93d',
  verde: '#35c46b',
  azul: '#3d8bfd',
  morado: '#a259e6',
  blanco: '#ffffff',
} as const

export type Color = (typeof PALETA)[keyof typeof PALETA]
